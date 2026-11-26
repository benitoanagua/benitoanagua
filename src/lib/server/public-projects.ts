import type { Project, ProjectArea, ProjectStatus } from '$lib/types/Project';

interface ProjectRow {
	slug: string;
	sort_order: number;
	content_es: string;
	content_en: string;
	is_published: number;
}

const AREAS: ProjectArea[] = ['dev', 'design', 'graphic', 'analysis', 'games'];
const STATUSES: ProjectStatus[] = ['wip', 'done', 'spec'];

function isOptionalString(value: unknown): boolean {
	return value === undefined || typeof value === 'string';
}

function isProjectLinks(value: unknown): boolean {
	if (value === undefined) return true;
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
	const links = value as Record<string, unknown>;
	return ['repo', 'demo', 'case'].every(
		(key) => links[key] === undefined || typeof links[key] === 'string'
	);
}

function parseProject(raw: string, slug: string): Project {
	let value: unknown;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error(`[public-projects] Invalid JSON payload for project "${slug}"`);
	}
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		throw new Error(`[public-projects] Project "${slug}" payload is not an object`);
	}
	const p = value as Record<string, unknown>;
	if (
		p.slug !== slug ||
		typeof p.title !== 'string' ||
		typeof p.area !== 'string' ||
		!AREAS.includes(p.area as ProjectArea) ||
		typeof p.year !== 'string' ||
		typeof p.role !== 'string' ||
		typeof p.summary !== 'string' ||
		!Array.isArray(p.stack) ||
		!p.stack.every((item) => typeof item === 'string') ||
		!Array.isArray(p.skills) ||
		!p.skills.every((item) => typeof item === 'string') ||
		!Array.isArray(p.highlights) ||
		!p.highlights.every((item) => typeof item === 'string') ||
		(p.status !== undefined && !STATUSES.includes(p.status as ProjectStatus)) ||
		(p.featured !== undefined && typeof p.featured !== 'boolean') ||
		!isOptionalString(p.context) ||
		!isOptionalString(p.result) ||
		!isProjectLinks(p.links)
	) {
		throw new Error(`[public-projects] Project "${slug}" payload failed validation`);
	}
	return p as unknown as Project;
}

/**
 * Published projects from D1, localized as separate payloads. There is no
 * bundled fallback: a missing binding, query failure or invalid published
 * payload is a hard error so a misconfigured database cannot silently serve
 * stale or partial content.
 */
export async function loadPublicProjects(
	platform?: App.Platform
): Promise<Record<'es' | 'en', Project[]>> {
	let db: App.Platform['env']['DB'];
	try {
		db = platform?.env?.DB;
	} catch {
		db = undefined;
	}
	if (!db) {
		throw new Error('[public-projects] D1 binding DB is unavailable.');
	}

	let results: ProjectRow[];
	try {
		const response = await db
			.prepare(
				`SELECT slug, sort_order, content_es, content_en, is_published
				 FROM portfolio_projects
				 WHERE is_published = 1
				 ORDER BY sort_order, slug`
			)
			.all<ProjectRow>();
		results = response.results ?? [];
	} catch (error) {
		throw new Error(`[public-projects] D1 read failed: ${String(error)}`);
	}

	const projects = { es: [] as Project[], en: [] as Project[] };
	for (const row of results) {
		if (row.is_published !== 1) continue;
		projects.es.push(parseProject(row.content_es, row.slug));
		projects.en.push(parseProject(row.content_en, row.slug));
	}
	return projects;
}
