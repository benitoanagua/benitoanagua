import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/admin-access';

export const prerender = false;

type Area = 'dev' | 'design' | 'graphic' | 'analysis' | 'games';
type Status = 'wip' | 'done' | 'spec';
interface ProjectDocument {
	slug: string;
	area: Area;
	year: string;
	featured: number;
	status: Status | null;
	sort_order: number;
	content_es: string;
	content_en: string;
	is_published: number;
	updated_at: string;
}
interface ProjectPayload {
	slug: string;
	title: string;
	area: Area;
	year: string;
	role: string;
	summary: string;
	featured?: boolean;
	status?: Status;
	stack: string[];
	skills: string[];
	context?: string;
	highlights: string[];
	result?: string;
	links?: { repo?: string; demo?: string; case?: string };
}
const AREAS: Area[] = ['dev', 'design', 'graphic', 'analysis', 'games'];
const STATUSES: Status[] = ['wip', 'done', 'spec'];

function parseProject(raw: unknown): ProjectPayload | null {
	if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
	const p = raw as Record<string, unknown>;
	if (
		typeof p.slug !== 'string' ||
		!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) ||
		typeof p.title !== 'string' ||
		!p.title.trim() ||
		typeof p.area !== 'string' ||
		!AREAS.includes(p.area as Area) ||
		typeof p.year !== 'string' ||
		typeof p.role !== 'string' ||
		typeof p.summary !== 'string' ||
		!Array.isArray(p.stack) ||
		!p.stack.every((v) => typeof v === 'string') ||
		!Array.isArray(p.skills) ||
		!p.skills.every((v) => typeof v === 'string') ||
		!Array.isArray(p.highlights) ||
		!p.highlights.every((v) => typeof v === 'string') ||
		(p.status !== undefined && !STATUSES.includes(p.status as Status)) ||
		(p.featured !== undefined && typeof p.featured !== 'boolean')
	)
		return null;
	return p as unknown as ProjectPayload;
}

export const load: PageServerLoad = async ({ request, platform }) => {
	await requireAdmin(request, platform?.env);
	const db = platform?.env?.DB;
	if (!db) error(503, 'The D1 binding DB is unavailable.');
	const { results } = await db
		.prepare(
			'SELECT slug, area, year, featured, status, sort_order, content_es, content_en, is_published, updated_at FROM portfolio_projects ORDER BY sort_order, slug'
		)
		.all<ProjectDocument>();
	return { projects: results ?? [] };
};

export const actions: Actions = {
	save: async ({ request, platform }) => {
		await requireAdmin(request, platform?.env);
		const db = platform?.env?.DB;
		if (!db) error(503, 'The D1 binding DB is unavailable.');
		const form = await request.formData();
		const esRaw = form.get('content_es');
		const enRaw = form.get('content_en');
		const published = form.get('is_published') === '1' ? 1 : 0;
		if (typeof esRaw !== 'string' || typeof enRaw !== 'string') {
			return fail(400, { message: 'Both Spanish and English JSON documents are required.' });
		}
		let es: ProjectPayload | null;
		let en: ProjectPayload | null;
		try {
			es = parseProject(JSON.parse(esRaw));
			en = parseProject(JSON.parse(enRaw));
		} catch {
			return fail(400, { message: 'Both project documents must be valid JSON.' });
		}
		if (!es || !en || es.slug !== en.slug) {
			return fail(400, { message: 'Invalid project structure or localized slugs do not match.' });
		}
		if (
			es.area !== en.area ||
			es.year !== en.year ||
			JSON.stringify(es.stack) !== JSON.stringify(en.stack) ||
			JSON.stringify(es.skills) !== JSON.stringify(en.skills)
		) {
			return fail(400, { message: 'Area, year, stack and skills must match across locales.' });
		}
		const orderValue = Number(form.get('sort_order'));
		const sortOrder = Number.isInteger(orderValue) && orderValue >= 0 ? orderValue : 9999;
		await db
			.prepare(
				`INSERT INTO portfolio_projects
			(slug, area, year, featured, status, sort_order, content_es, content_en, is_published)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(slug) DO UPDATE SET area=excluded.area, year=excluded.year,
			featured=excluded.featured, status=excluded.status, sort_order=excluded.sort_order,
			content_es=excluded.content_es, content_en=excluded.content_en,
			is_published=excluded.is_published, updated_at=CURRENT_TIMESTAMP`
			)
			.bind(
				es.slug,
				es.area,
				es.year,
				es.featured ? 1 : 0,
				es.status ?? null,
				sortOrder,
				JSON.stringify(es),
				JSON.stringify(en),
				published
			)
			.run();
		return { success: true, message: `Project "${es.slug}" saved in D1.` };
	},
	delete: async ({ request, platform }) => {
		await requireAdmin(request, platform?.env);
		const db = platform?.env?.DB;
		if (!db) error(503, 'The D1 binding DB is unavailable.');
		const form = await request.formData();
		const slug = form.get('slug');
		if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
			return fail(400, { message: 'Invalid project slug.' });
		}
		await db.prepare('DELETE FROM portfolio_projects WHERE slug = ?').bind(slug).run();
		return { success: true, message: `Project "${slug}" deleted from D1.` };
	}
};
