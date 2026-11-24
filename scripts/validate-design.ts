/**
 * Valida las reglas duras del sistema FOLIO antes del build (Art. 26–30).
 *  - tamaño de fuente ≥ 1rem en todo el código (tokens --text-* incluidos)
 *  - border-radius solo tokens --radius-* o 0 (sin píldoras ni curvas grandes)
 *  - sin elevación: box-shadow solo `none`
 *  - sin literales de color/fuente fuera de theme.css y tokens.css
 *  - text-transform: uppercase solo en utilities.css y PortalLayout (wordmark)
 *  - contraste WCAG AA (4.5:1 texto, 3:1 UI) en ambos temas
 * Errores → exit 1. Avisos → informativos.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'src');

const errors: string[] = [];
const warnings: string[] = [];
const err = (file: string, line: number, msg: string) =>
	errors.push(`${path.relative(root, file)}:${line} — ${msg}`);
const warn = (file: string, line: number, msg: string) =>
	warnings.push(`${path.relative(root, file)}:${line} — ${msg}`);

/* ── Recolección de archivos ── */
function walk(dir: string, out: string[] = []): string[] {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walk(p, out);
		else if (/\.(svelte|css)$/.test(e.name)) out.push(p);
	}
	return out;
}
const files = walk(SRC);
const rel = (f: string) => path.relative(root, f);
const TOKENS = path.join(SRC, 'lib/design-system/tokens.css');
const THEME = path.join(SRC, 'lib/styles/theme.css');
const UTILITIES = path.join(SRC, 'lib/design-system/utilities.css');
const LAYOUT = path.join(SRC, 'lib/components/PortalLayout.svelte');
const isExempt = (f: string) => f === THEME || f === TOKENS;

/* ── Tokens de tamaño de fuente ── */
const tokensCss = fs.readFileSync(TOKENS, 'utf-8');
const textTokens = new Map<string, string>();
for (const m of tokensCss.matchAll(/--(text-[\w-]+)\s*:\s*([^;]+);/g)) {
	textTokens.set(`--${m[1]}`, m[2].trim());
}

/** Devuelve el tamaño mínimo en px de un valor CSS de font-size, o null si no se puede evaluar. */
function minPx(value: string, depth = 0): number | null {
	if (depth > 4) return null;
	const v = value.trim();
	const clamp = v.match(/^clamp\(\s*([^,]+),/);
	if (clamp) return minPx(clamp[1], depth + 1);
	const varRef = v.match(/^var\((--[\w-]+)\)/);
	if (varRef) {
		const t = textTokens.get(varRef[1]);
		return t ? minPx(t, depth + 1) : null;
	}
	const num = v.match(/^(\d*\.?\d+)(px|rem|em|%)?$/);
	if (!num) return null;
	const n = parseFloat(num[1]);
	const unit = num[2] ?? 'px';
	if (unit === 'px') return n;
	if (unit === 'rem') return n * 16;
	if (unit === 'em') return n * 16; // el tamaño mínimo del sitio es 1rem
	if (unit === '%') return (n / 100) * 16;
	return null;
}

/* ── Reglas sobre archivos fuente ── */
const DECL = /([\w-]+)\s*:\s*([^;{}]+);/g;
for (const file of files) {
	const src = fs.readFileSync(file, 'utf-8');
	const lines = src.split('\n');
	lines.forEach((line, i) => {
		const ln = i + 1;
		// font-size
		const fsMatch = line.match(/font-size\s*:\s*([^;]+)/);
		if (fsMatch) {
			const px = minPx(fsMatch[1]);
			if (px !== null && px < 16)
				err(file, ln, `font-size ${fsMatch[1].trim()} equivale a ${px}px < 1rem`);
		}
		// border-radius
		const radius = line.match(/border-radius\s*:\s*([^;]+)/);
		if (radius) {
			const v = radius[1].trim();
			const ok =
				/var\(--radius/.test(v) ||
				/^(0|0px|inherit|initial|unset|none)\b/.test(v) ||
				v.split(/\s+/).every((p) => /^(0|0px|var\(--radius[\w-]*\))$/.test(p));
			if (!ok) err(file, ln, `border-radius no permitido (solo --radius-* o 0): ${v}`);
		}
		// box-shadow
		const shadow = line.match(/box-shadow\s*:\s*([^;]+)/);
		if (shadow && !/^\s*none\s*$/.test(shadow[1]) && !/var\(--shadow/.test(shadow[1])) {
			err(file, ln, `box-shadow no permitido (FOLIO no usa elevación): ${shadow[1].trim()}`);
		}
		// literales de color (hex / rgb / hsl) — enmascarados en mask-image son alfa, no color
		if (!/mask(-image)?\s*:/.test(line)) {
			const hex = line.match(/#[0-9a-fA-F]{3,8}\b/);
			const fn = line.match(/\b(?:rgba?|hsla?)\(/);
			if ((hex || fn) && !isExempt(file)) {
				err(file, ln, `literal de color fuera de tokens: ${line.trim().slice(0, 80)}`);
			}
		}
		// font-family debe usar tokens
		const ff = line.match(/font-family\s*:\s*([^;]+)/);
		if (ff && !isExempt(file) && !/var\(--font-/.test(ff[1]) && !/inherit|system-ui/.test(ff[1])) {
			err(file, ln, `font-family sin token --font-*: ${ff[1].trim()}`);
		}
		// uppercase solo en roles permitidos
		const tt = line.match(/text-transform\s*:\s*uppercase/);
		if (tt && file !== UTILITIES && file !== LAYOUT) {
			err(file, ln, 'text-transform: uppercase fuera de .kicker/.meta/.label/wordmark');
		}
	});
	// atajo font: (puede ocupar varias líneas) — el tamaño debe venir de un token --text-*
	if (!isExempt(file)) {
		for (const m of src.matchAll(/(?:^|[\s{;])font\s*:\s*([^;]+)/g)) {
			const value = m[1];
			const sizePart = value.split('/')[0];
			if (/\d*\.?\d+(px|rem|em|%)\b/.test(sizePart) && !/var\(--text-/.test(value)) {
				const ln = src.slice(0, m.index).split('\n').length;
				err(file, ln, `font shorthand sin token de tamaño: ${value.trim().slice(0, 80)}`);
			}
		}
	}
}

/* ── Tokens --text-* ≥ 1rem ── */
for (const [name, value] of textTokens) {
	const px = minPx(value);
	if (px === null) warnings.push(`tokens.css — no pude evaluar ${name}: ${value}`);
	else if (px < 16) errors.push(`tokens.css — ${name} = ${value} equivale a ${px}px < 1rem`);
}

/* ── Contraste WCAG AA en ambos temas ── */
function parseTheme(file: string): Record<string, Record<string, string>> {
	const css = fs.readFileSync(file, 'utf-8');
	const blocks: Record<string, Record<string, string>> = { light: {}, dark: {} };
	const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
	const darkMatch = css.match(/\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/);
	for (const [key, block] of [
		['light', rootMatch?.[1]],
		['dark', darkMatch?.[1]]
	] as const) {
		if (!block) continue;
		for (const m of block.matchAll(/--(color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) {
			blocks[key][`--${m[1]}`] = m[2];
		}
	}
	return blocks;
}

function luminance(hex: string): number {
	let h = hex.replace('#', '');
	if (h.length === 3)
		h = h
			.split('')
			.map((c) => c + c)
			.join('');
	const [r, g, b] = [0, 2, 4].map((i) => {
		const c = parseInt(h.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
	const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (l1 + 0.05) / (l2 + 0.05);
}

const themes = parseTheme(THEME);
// pares [texto, fondo] que deben cumplir 4.5:1
const TEXT_PAIRS: [string, string][] = [
	['--color-on-background', '--color-background'],
	['--color-on-surface', '--color-surface'],
	['--color-on-surface-variant', '--color-background'],
	['--color-on-surface-variant', '--color-surface-container'],
	['--color-on-surface-variant', '--color-surface-container-high'],
	['--color-ink-soft', '--color-background'],
	['--color-ink-soft', '--color-surface-container'],
	['--color-primary', '--color-background'],
	['--color-primary', '--color-surface'],
	['--color-primary', '--color-surface-container'],
	['--color-on-primary', '--color-primary'],
	['--color-on-secondary', '--color-secondary'],
	['--color-on-secondary-container', '--color-secondary-container'],
	['--color-on-tertiary', '--color-tertiary'],
	['--color-on-tertiary-container', '--color-tertiary-container'],
	['--color-on-error', '--color-error'],
	['--color-on-error-container', '--color-error-container'],
	['--color-on-primary-container', '--color-primary-container'],
	['--color-success', '--color-background'],
	['--color-success', '--color-surface-container'],
	['--color-warning', '--color-background'],
	['--color-warning', '--color-surface-container'],
	['--color-inverse-on-surface', '--color-inverse-surface']
];
// pares de componentes de UI que deben cumplir 3:1
const UI_PAIRS: [string, string][] = [
	['--color-outline', '--color-background'],
	['--color-outline', '--color-surface-container'],
	['--color-primary', '--color-surface-container-high']
];

for (const themeName of ['light', 'dark'] as const) {
	const t = themes[themeName];
	for (const [fg, bg] of TEXT_PAIRS) {
		const a = t[fg];
		const b = t[bg];
		if (!a || !b) {
			warnings.push(`theme.css — falta ${fg} o ${bg} en tema ${themeName}`);
			continue;
		}
		const ratio = contrast(a, b);
		if (ratio < 4.5)
			errors.push(
				`theme.css [${themeName}] — ${fg} sobre ${bg}: ${ratio.toFixed(2)}:1 < 4.5:1 (AA texto)`
			);
	}
	for (const [fg, bg] of UI_PAIRS) {
		const a = t[fg];
		const b = t[bg];
		if (!a || !b) continue;
		const ratio = contrast(a, b);
		if (ratio < 3)
			warnings.push(
				`theme.css [${themeName}] — ${fg} sobre ${bg}: ${ratio.toFixed(2)}:1 < 3:1 (AA componente)`
			);
	}
}

/* ── Informe ── */
for (const w of warnings) console.warn(`aviso: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(
	`validate-design: ${errors.length} errores, ${warnings.length} avisos en ${files.length} archivos`
);
if (errors.length) process.exit(1);
