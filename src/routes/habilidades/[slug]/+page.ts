import { error } from '@sveltejs/kit';
import { getSkillProfile, getSkillProfileEntries } from '$lib/data/skill-profiles';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => getSkillProfileEntries();
export const load: PageLoad = ({ params }) => {
  const skill = getSkillProfile(params.slug);
  if (!skill) error(404, 'Skill not found');
  return { skill };
};
