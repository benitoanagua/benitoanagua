import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;

/** Project routes are resolved against the runtime D1-backed layout data. */
export const load: PageLoad = async ({ params, parent }) => {
	const { projects } = await parent();
	const exists = projects?.es.some((project) => project.slug === params.slug) ||
		projects?.en.some((project) => project.slug === params.slug);
	if (!exists) error(404, 'Project not found');
	return { slug: params.slug };
};
