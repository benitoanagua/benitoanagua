import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/admin-access';

export const prerender = false;

interface CountRow {
	total: number;
	published?: number | null;
}
interface ContentUpdate {
	content_key: string;
	locale: string;
	updated_at: string | null;
}
interface ProjectUpdate {
	slug: string;
	updated_at: string | null;
}

export const load: PageServerLoad = async ({ request, platform }) => {
	await requireAdmin(request, platform?.env);
	const db = platform?.env?.DB;
	if (!db) error(503, 'The D1 binding DB is unavailable.');

	const [content, projects, recentContent, recentProjects] = await Promise.all([
		db.prepare('SELECT COUNT(*) AS total FROM portfolio_content').first<CountRow>(),
		db.prepare('SELECT COUNT(*) AS total, SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) AS published FROM portfolio_projects').first<CountRow>(),
		db.prepare('SELECT content_key, locale, updated_at FROM portfolio_content ORDER BY updated_at DESC LIMIT 4').all<ContentUpdate>(),
		db.prepare('SELECT slug, updated_at FROM portfolio_projects ORDER BY updated_at DESC LIMIT 4').all<ProjectUpdate>()
	]);

	return {
		contentCount: content?.total ?? 0,
		projectCount: projects?.total ?? 0,
		publishedProjectCount: projects?.published ?? 0,
		recentContent: recentContent.results ?? [],
		recentProjects: recentProjects.results ?? []
	};
};
