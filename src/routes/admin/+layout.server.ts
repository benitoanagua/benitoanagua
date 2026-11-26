import type { LayoutServerLoad } from './$types';
import { requireAdmin } from '$lib/server/admin-access';

export const prerender = false;

export const load: LayoutServerLoad = async ({ request, platform, url, setHeaders }) => {
	setHeaders({
		'cache-control': 'private, no-store',
		'x-robots-tag': 'noindex, nofollow'
	});
	const admin = await requireAdmin(request, platform?.env);
	const activeSection: 'dashboard' | 'projects' | 'content' = url.pathname.startsWith(
		'/admin/proyectos'
	)
		? 'projects'
		: url.pathname.startsWith('/admin/dashboard')
			? 'dashboard'
			: 'content';
	return { adminEmail: admin.email, activeSection };
};
