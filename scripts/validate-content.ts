/**
 * Valida la coherencia del contenido antes del build.
 *  - projects.es/en: mismos slugs, áreas, stack y skills; slugs válidos y únicos; highlights presentes
 *  - skills de proyectos que no existen en los CV → aviso (se muestran sin enlace)
 * Errores → exit 1. Avisos → informativos.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'toml';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f: string) => parse(fs.readFileSync(path.join(root, 'src/lib/data', f), 'utf-8'));
const slugify = (v: string) =>
	v
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

const AREAS = ['dev', 'design', 'graphic', 'analysis', 'games'];
const STATUSES = ['wip', 'done', 'spec'];
type P = {
	slug: string;
	area: string;
	status?: string;
	skills: string[];
	stack: string[];
	highlights: string[];
	links?: unknown;
};
const projects = {
	es: (read('projects.es.toml') as { projects: P[] }).projects,
	en: (read('projects.en.toml') as { projects: P[] }).projects
};
const cv = read('cv.es.toml') as { focuses: { skills?: { items?: string[] }[] }[] };

const errors: string[] = [];
const warnings: string[] = [];

const slugs = projects.es.map((p) => p.slug);
if (new Set(slugs).size !== slugs.length) errors.push('Slugs de proyecto duplicados');
if (projects.es.length !== projects.en.length)
	errors.push('projects.es y projects.en tienen distinta cantidad de proyectos');

projects.es.forEach((p, i) => {
	const en = projects.en[i];
	if (!/^[a-z0-9-]+$/.test(p.slug))
		errors.push(`${p.slug}: el slug solo admite a-z, 0-9 y guiones`);
	if (!AREAS.includes(p.area)) errors.push(`${p.slug}: área inválida "${p.area}"`);
	if (p.status && !STATUSES.includes(p.status))
		errors.push(`${p.slug}: status inválido "${p.status}"`);
	if (!p.highlights?.length) errors.push(`${p.slug}: sin highlights`);
	if (!en || en.slug !== p.slug)
		errors.push(`Proyecto #${i + 1}: slug distinto entre es/en (${p.slug} vs ${en?.slug})`);
	else {
		for (const k of ['area', 'status', 'skills', 'stack'] as const)
			if (JSON.stringify(en[k]) !== JSON.stringify(p[k]))
				errors.push(`${p.slug}: "${k}" distinto entre es/en`);
	}
});

const cvSlugs = new Set(
	(cv.focuses ?? []).flatMap((f) => (f.skills ?? []).flatMap((g) => (g.items ?? []).map(slugify)))
);
const unlinked = new Set<string>();
for (const p of projects.es)
	for (const s of p.skills) if (!cvSlugs.has(slugify(s))) unlinked.add(s);
if (unlinked.size)
	warnings.push(
		`${unlinked.size} skills de proyectos sin ficha en /habilidades (se muestran sin enlace): ${[...unlinked].join(', ')}`
	);
const noLinks = projects.es.filter((p) => !p.links);
if (noLinks.length)
	warnings.push(
		`${noLinks.length}/${projects.es.length} proyectos sin enlaces (repo/demo/caso). Ver CONTENIDO_PENDIENTE.md`
	);

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
	for (const e of errors) console.error(`✗ ${e}`);
	process.exit(1);
}
console.log(`✓ Contenido válido: ${projects.es.length} proyectos`);
