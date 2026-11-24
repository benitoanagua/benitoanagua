import { parse } from 'toml';
import type { Project, ProjectsData } from '$lib/types/Project';
import { lang, type Language } from '$lib/state/lang.svelte';
import { slugify } from '$lib/utils/slug';
import { getSkillProfileEntries } from './skill-profiles';
import projectsEs from './projects.es.toml?raw';
import projectsEn from './projects.en.toml?raw';

const parsed: Record<Language, Project[]> = {
	es: (parse(projectsEs) as ProjectsData).projects,
	en: (parse(projectsEn) as ProjectsData).projects
};

export function getProjects(language: Language = lang.current): Project[] {
	return parsed[language === 'en' ? 'en' : 'es'];
}

export function getFeaturedProjects(language: Language = lang.current): Project[] {
	return getProjects(language).filter((p) => p.featured);
}

export function getProject(slug: string, language: Language = lang.current): Project | undefined {
	return getProjects(language).find((p) => p.slug === slug);
}

/** Slugs (idénticos en es/en) para prerender y sitemap. */
export function getProjectSlugs(): string[] {
	return parsed.es.map((p) => p.slug);
}

/** Proyectos que aplican una habilidad (por slug de /habilidades/<slug>). */
export function getProjectsForSkill(
	skillSlug: string,
	language: Language = lang.current
): Project[] {
	return getProjects(language).filter((p) => p.skills.some((s) => slugify(s) === skillSlug));
}

let skillSlugs: Set<string> | undefined;
/** ¿Existe una ficha /habilidades/<slug> para esta habilidad? */
export function hasSkillPage(name: string): boolean {
	skillSlugs ??= new Set(getSkillProfileEntries().map((e) => e.slug));
	return skillSlugs.has(slugify(name));
}
