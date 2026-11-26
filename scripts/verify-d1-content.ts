/**
 * Verifies the integrity of the local D1 database (`benitoanagua-portfolio`).
 *
 * Read-only: it queries the local database through Wrangler and validates the
 * portfolio_content, portfolio_cv_documents and portfolio_projects tables
 * against the structures the runtime loaders expect.
 *
 * Requires the local database to be migrated and seeded first:
 *   pnpm d1:migrations:local
 *
 * Exits with code 1 when any error is found. Warnings are informational.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATABASE = 'benitoanagua-portfolio';
const LOCALES = ['es', 'en'] as const;
const CONTENT_KEYS = ['cv', 'site', 'skill_stories'] as const;
const AREAS = ['dev', 'design', 'graphic', 'analysis', 'games'];
const STATUSES = ['wip', 'done', 'spec'];

const errors: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
	errors.push(message);
}
function warn(message: string) {
	warnings.push(message);
}

function query<T>(sql: string): T[] {
	const out = execFileSync(
		'pnpm',
		['dlx', 'wrangler@4', 'd1', 'execute', DATABASE, '--local', '--json', '--command', sql],
		{ cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
	);
	const parsed = JSON.parse(out) as { results?: T[] }[];
	return parsed[0]?.results ?? [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function slugify(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

interface ContentRow {
	locale: string;
	content_key: string;
	payload_json: string;
}
interface DocumentRow {
	locale: string;
	document_key: string;
	label: string;
	public_path: string;
	mime_type: string | null;
	sort_order: number | null;
	is_current: number;
}
interface ProjectRow {
	slug: string;
	area: string;
	year: string;
	featured: number;
	status: string | null;
	sort_order: number;
	content_es: string;
	content_en: string;
	is_published: number;
}

function parsePayload(raw: string, label: string): Record<string, unknown> | null {
	try {
		const value: unknown = JSON.parse(raw);
		if (!isRecord(value)) {
			fail(`${label}: payload is not a JSON object`);
			return null;
		}
		return value;
	} catch {
		fail(`${label}: payload is not valid JSON`);
		return null;
	}
}

function checkContent() {
	const rows = query<ContentRow>('SELECT locale, content_key, payload_json FROM portfolio_content');
	const seen = new Set<string>();
	const payloads = new Map<string, Record<string, unknown>>();
	for (const row of rows) {
		const id = `${row.locale}:${row.content_key}`;
		if (seen.has(id)) fail(`portfolio_content: duplicate row ${id}`);
		seen.add(id);
		if (
			!LOCALES.includes(row.locale as (typeof LOCALES)[number]) ||
			!CONTENT_KEYS.includes(row.content_key as (typeof CONTENT_KEYS)[number])
		) {
			fail(`portfolio_content: unexpected row ${id}`);
			continue;
		}
		const payload = parsePayload(row.payload_json, `portfolio_content ${id}`);
		if (payload) payloads.set(id, payload);
	}
	for (const locale of LOCALES) {
		for (const key of CONTENT_KEYS) {
			if (!seen.has(`${locale}:${key}`)) {
				fail(`portfolio_content: missing ${locale}:${key}`);
			}
		}
	}

	for (const locale of LOCALES) {
		const cv = payloads.get(`${locale}:cv`);
		if (cv) {
			if (!isRecord(cv.personal) || typeof cv.personal.name !== 'string') {
				fail(`portfolio_content ${locale}:cv: missing personal.name`);
			}
			if (!Array.isArray(cv.education))
				fail(`portfolio_content ${locale}:cv: education is not an array`);
			if (!Array.isArray(cv.focuses) || cv.focuses.length === 0) {
				fail(`portfolio_content ${locale}:cv: focuses missing or empty`);
			}
		}
		const site = payloads.get(`${locale}:site`);
		if (site) {
			for (const section of ['meta', 'nav', 'home', 'footer'] as const) {
				if (!isRecord(site[section])) {
					fail(`portfolio_content ${locale}:site: missing ${section}`);
				}
			}
		}
		const stories = payloads.get(`${locale}:skill_stories`);
		if (stories) {
			for (const [slug, text] of Object.entries(stories)) {
				if (typeof text !== 'string') {
					fail(`portfolio_content ${locale}:skill_stories: "${slug}" is not a string`);
				}
			}
		}
	}

	const esStories = payloads.get('es:skill_stories');
	const enStories = payloads.get('en:skill_stories');
	if (esStories && enStories) {
		const esKeys = new Set(Object.keys(esStories));
		const enKeys = new Set(Object.keys(enStories));
		for (const key of esKeys)
			if (!enKeys.has(key)) warn(`skill_stories "${key}" missing English text`);
		for (const key of enKeys)
			if (!esKeys.has(key)) warn(`skill_stories "${key}" missing Spanish text`);
	}
	return payloads.get('es:cv');
}

function checkDocuments() {
	const rows = query<DocumentRow>(
		`SELECT locale, document_key, label, public_path, mime_type, sort_order, is_current
		 FROM portfolio_cv_documents ORDER BY locale, sort_order`
	);
	if (rows.length === 0) {
		fail('portfolio_cv_documents: no rows at all');
		return;
	}
	const seen = new Set<string>();
	let current = 0;
	for (const row of rows) {
		const id = `${row.locale}:${row.document_key}`;
		if (seen.has(id)) fail(`portfolio_cv_documents: duplicate row ${id}`);
		seen.add(id);
		if (row.is_current === 1) {
			current++;
			if (typeof row.public_path !== 'string' || !row.public_path.startsWith('/')) {
				fail(`portfolio_cv_documents ${id}: public_path must be absolute`);
			} else if (row.public_path.startsWith('/cv/')) {
				const file = path.join(root, 'static', row.public_path);
				if (!existsSync(file)) {
					fail(`portfolio_cv_documents ${id}: ${row.public_path} does not exist in static/`);
				}
			}
		}
	}
	if (current === 0) fail('portfolio_cv_documents: no current documents');
}

function checkProjects(cvEs: Record<string, unknown> | undefined) {
	const rows = query<ProjectRow>(
		`SELECT slug, area, year, featured, status, sort_order,
		        content_es, content_en, is_published
		 FROM portfolio_projects ORDER BY sort_order, slug`
	);
	if (rows.length === 0) {
		warn('portfolio_projects: table is empty (no projects published)');
		return;
	}
	const seen = new Set<string>();
	const orders = new Set<number>();
	let published = 0;
	for (const row of rows) {
		if (seen.has(row.slug)) fail(`portfolio_projects: duplicate slug "${row.slug}"`);
		seen.add(row.slug);
		if (!AREAS.includes(row.area))
			fail(`portfolio_projects "${row.slug}": invalid area "${row.area}"`);
		if (row.status !== null && !STATUSES.includes(row.status)) {
			fail(`portfolio_projects "${row.slug}": invalid status "${row.status}"`);
		}
		if (row.is_published !== 0 && row.is_published !== 1) {
			fail(`portfolio_projects "${row.slug}": is_published must be 0 or 1`);
		}
		if (row.is_published === 1) published++;
		if (orders.has(row.sort_order)) {
			warn(`portfolio_projects: duplicate sort_order ${row.sort_order}`);
		}
		orders.add(row.sort_order);

		const es = parsePayload(row.content_es, `portfolio_projects "${row.slug}" content_es`);
		const en = parsePayload(row.content_en, `portfolio_projects "${row.slug}" content_en`);
		if (!es || !en) continue;
		if (es.slug !== row.slug || en.slug !== row.slug) {
			fail(`portfolio_projects "${row.slug}": payload slug does not match row slug`);
		}
		if (es.slug !== en.slug) {
			fail(`portfolio_projects "${row.slug}": localized slugs differ`);
		}
		for (const field of ['area', 'year', 'stack', 'skills'] as const) {
			if (JSON.stringify(es[field]) !== JSON.stringify(en[field])) {
				fail(`portfolio_projects "${row.slug}": "${field}" differs between es/en`);
			}
		}
		for (const required of ['title', 'role', 'summary'] as const) {
			if (typeof es[required] !== 'string' || typeof en[required] !== 'string') {
				fail(`portfolio_projects "${row.slug}": missing localized "${required}"`);
			}
		}
		if (!Array.isArray(es.highlights) || !Array.isArray(en.highlights)) {
			fail(`portfolio_projects "${row.slug}": highlights must be arrays`);
		}
	}
	if (published === 0) warn('portfolio_projects: no published projects');

	// Skills referenced by projects should resolve to a /habilidades page.
	if (cvEs && Array.isArray(cvEs.focuses)) {
		const cvSlugs = new Set<string>();
		for (const focus of cvEs.focuses) {
			if (!isRecord(focus) || !Array.isArray(focus.skills)) continue;
			for (const group of focus.skills) {
				if (!isRecord(group) || !Array.isArray(group.items)) continue;
				for (const item of group.items) {
					if (typeof item === 'string') cvSlugs.add(slugify(item));
				}
			}
		}
		const unlinked = new Set<string>();
		for (const row of rows) {
			if (row.is_published !== 1) continue;
			const es = parsePayload(row.content_es, `portfolio_projects "${row.slug}" content_es`);
			if (!es || !Array.isArray(es.skills)) continue;
			for (const skill of es.skills) {
				if (typeof skill === 'string' && !cvSlugs.has(slugify(skill))) unlinked.add(skill);
			}
		}
		if (unlinked.size) {
			warn(
				`${unlinked.size} project skills have no /habilidades page (shown without link): ${[...unlinked].join(', ')}`
			);
		}
	}
}

function main() {
	let cvEs: Record<string, unknown> | undefined;
	try {
		cvEs = checkContent() as Record<string, unknown> | undefined;
		checkDocuments();
		checkProjects(cvEs);
	} catch (error) {
		fail(`Could not query local D1: ${String(error)}\nRun "pnpm d1:migrations:local" first.`);
	}

	for (const warning of warnings) console.warn(`⚠ ${warning}`);
	if (errors.length) {
		for (const error of errors) console.error(`✗ ${error}`);
		process.exit(1);
	}
	console.log('✓ D1 content integrity verified');
}

main();
