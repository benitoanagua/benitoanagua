import { error } from '@sveltejs/kit';
import { getSkillProfile, getSkillProfileEntries } from '$lib/data/skill-profiles';
import type { EntryGenerator, PageLoad } from './$types';

// Served from D1 at request time (see src/routes/+page.ts). `entries` is kept
// for documentation and in case prerendering is re-enabled later.
export const prerender = false;
export const entries: EntryGenerator = () => getSkillProfileEntries();
export const load: PageLoad = async ({ params, parent }) => {
	const { portfolio } = await parent();
	const skill = getSkillProfile(params.slug, portfolio);
	if (!skill) error(404, 'Skill not found');
	return { skill };
};
