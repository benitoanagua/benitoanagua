import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/admin-access';
import { isProjectSlug } from '$lib/server/project-payload';
import { saveProject } from '$lib/server/project-save';

export const prerender = false;

interface ProjectDocument {
	slug: string;
	area: string;
	year: string;
	featured: number;
	status: string | null;
	sort_order: number;
	content_es: string;
	content_en: string;
	is_published: number;
	updated_at: string;
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
		const result = await saveProject(db, form);
		if (!result.ok) return fail(result.status, { message: result.message });
		return { success: true, message: result.message };
	},
	delete: async ({ request, platform }) => {
		await requireAdmin(request, platform?.env);
		const db = platform?.env?.DB;
		if (!db) error(503, 'The D1 binding DB is unavailable.');
		const form = await request.formData();
		const slug = form.get('slug');
		if (typeof slug !== 'string' || !isProjectSlug(slug)) {
			return fail(400, { message: 'Invalid project slug.' });
		}
		await db.prepare('DELETE FROM portfolio_projects WHERE slug = ?').bind(slug).run();
		return { success: true, message: `Project "${slug}" deleted from D1.` };
	}
};
