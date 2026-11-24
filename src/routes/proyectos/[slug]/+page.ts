import { error } from '@sveltejs/kit';
import { getProjectSlugs } from '$lib/data/projects-loader';
import type { EntryGenerator, PageLoad } from './$types';

// Un HTML estático por proyecto (los slugs son idénticos en es/en)
export const entries: EntryGenerator = () => getProjectSlugs().map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	if (!getProjectSlugs().includes(params.slug)) error(404, 'Project not found');
	return { slug: params.slug };
};
