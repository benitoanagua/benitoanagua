import { error } from '@sveltejs/kit';
import { getSkillProfile, getSkillProfileEntries } from '$lib/data/skill-profiles';
import type { EntryGenerator, PageLoad } from './$types';

// Served from D1 at request time (see src/routes/+page.ts). `entries` is kept
// for documentation and in case prerendering is re-enabled later.
export const prerender = false;
export const entries: EntryGenerator = () => getSkillProfileEntries();
export const load: PageLoad = ({ params }) => {
	const skill = getSkillProfile(params.slug);
	if (!skill) error(404, 'Skill not found');
	return { skill };
};
