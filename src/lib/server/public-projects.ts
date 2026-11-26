import type { Project } from '$lib/types/Project';
import { parseProjectPayload } from './project-payload';

interface ProjectRow {
	slug: string;
	sort_order: number;
	content_es: string;
	content_en: string;
	is_published: number;
}

function parseProject(raw: string, slug: string): Project {
	let value: unknown;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error(`[public-projects] Invalid JSON payload for project "${slug}"`);
	}
	const project = parseProjectPayload(value, slug);
	if (!project) {
		throw new Error(`[public-projects] Project "${slug}" payload failed validation`);
	}
	return project;
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
