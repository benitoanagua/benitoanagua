import type { LayoutServerLoad } from './$types';
import { requireAdmin } from '$lib/server/admin-access';

export const prerender = false;

export const load: LayoutServerLoad = async ({ request, platform }) => {
	const admin = await requireAdmin(request, platform?.env);
	return { adminEmail: admin.email };
};
