import type { Project, ProjectArea, ProjectStatus } from '$lib/types/Project';
import { getProjects as getBundledProjects } from '$lib/data/projects-loader';

interface ProjectRow {
	slug: string;
	sort_order: number;
	content_es: string;
	content_en: string;
	is_published: number;
}

export interface PublicProjectsResult {
	projects: Record<'es' | 'en', Project[]>;
	source: 'd1' | 'fallback';
}

const AREAS: ProjectArea[] = ['dev', 'design', 'graphic', 'analysis', 'games'];
const STATUSES: ProjectStatus[] = ['wip', 'done', 'spec'];

function resolveDb(platform?: App.Platform) {
	try {
		return platform?.env?.DB;
	} catch {
		return undefined;
	}
}

function parseProject(raw: string, slug: string): Project | null {
	try {
		const value: unknown = JSON.parse(raw);
		if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
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
			(p.featured !== undefined && typeof p.featured !== 'boolean')
		) return null;

		return p as unknown as Project;
	} catch {
		return null;
	}
}

function fallback(): PublicProjectsResult {
	return {
		projects: { es: getBundledProjects('es'), en: getBundledProjects('en') },
		source: 'fallback'
	};
}

/**
 * Published projects from D1, localized as separate payloads.
 * Bundled TOML is retained as a safe transition fallback until D1 is seeded
 * and verified in the Cloudflare environment.
 */
export async function loadPublicProjects(platform?: App.Platform): Promise<PublicProjectsResult> {
	const db = resolveDb(platform);
	if (!db) return fallback();

	try {
		const { results } = await db
			.prepare(
				'SELECT slug, sort_order, content_es, content_en, is_published FROM portfolio_projects ORDER BY sort_order, slug'
			)
			.all<ProjectRow>();

		if (!results?.length) {
			console.warn('[public-projects] D1 has no published project rows; using bundled fallback');
			return fallback();
		}

		const projects = { es: [] as Project[], en: [] as Project[] };
		for (const row of results) {
			if (row.is_published !== 1) continue;
			const es = parseProject(row.content_es, row.slug);
			const en = parseProject(row.content_en, row.slug);
			if (!es || !en) {
				console.warn('[public-projects] Invalid localized project payload:', row.slug);
				return fallback();
			}
			projects.es.push(es);
			projects.en.push(en);
		}
		return { projects, source: 'd1' };
	} catch (error) {
		console.warn('[public-projects] D1 read failed; using bundled fallback:', error);
		return fallback();
	}
}
