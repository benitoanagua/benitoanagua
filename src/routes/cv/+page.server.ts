import type { PageServerLoad } from './$types';
import { loadCvDocuments } from '$lib/server/portfolio-content';

// CV document metadata comes from D1 at request time (see src/routes/+page.ts).
export const prerender = false;

export const load: PageServerLoad = async ({ platform }) => ({
	documents: await loadCvDocuments(platform)
});
