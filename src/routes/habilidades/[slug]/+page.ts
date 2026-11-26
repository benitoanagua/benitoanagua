import { error } from '@sveltejs/kit';
import { getSkillProfile } from '$lib/data/skill-profiles';
import type { PageLoad } from './$types';

// Served from D1 at request time (see src/routes/+layout.ts).
export const load: PageLoad = async ({ params, parent }) => {
	const { portfolio } = await parent();
	const skill = getSkillProfile(params.slug, portfolio);
	if (!skill) error(404, 'Skill not found');
	return { skill };
};
