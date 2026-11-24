import { parse } from 'toml';
import type { CVData, Focus, Experience } from '$lib/types/CV';
import { lang } from '$lib/state/lang.svelte';
import cvEs from './cv.es.toml?raw';
import cvEn from './cv.en.toml?raw';
import { skillStories } from './skill-stories';
import type { PortfolioContent } from '$lib/types/Portfolio';

export interface SkillEvidence {
	focusName: string;
	focusTitle: string;
	experience: Experience;
	relevance: 'direct' | 'context';
}
export interface SkillProfile {
	slug: string;
	name: string;
	category: string;
	focusNames: string[];
	focusTitles: string[];
	summary: string;
	narrative: string;
	evidence: SkillEvidence[];
}

function dataFor(language: 'es' | 'en', content?: PortfolioContent | null): CVData {
	const localized = content?.cv[language];
	if (localized) return localized;
	return parse(language === 'en' ? cvEn : cvEs) as CVData;
}
function slugify(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
function buildProfiles(language: 'es' | 'en', content?: PortfolioContent | null): SkillProfile[] {
	const cv = dataFor(language, content);
	const bySlug = new Map<string, SkillProfile>();
	for (const focus of cv.focuses) {
		for (const group of focus.skills ?? []) {
			for (const item of group.items ?? []) {
				const slug = slugify(item);
				if (!slug) continue;
				const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const evidence = (focus.experiences ?? []).map((experience) => ({
					focusName: focus.name,
					focusTitle: focus.title,
					experience,
					relevance: new RegExp(escaped, 'i').test(experience.description)
						? ('direct' as const)
						: ('context' as const)
				}));
				const existing = bySlug.get(slug);
				if (existing) {
					if (!existing.focusNames.includes(focus.name)) existing.focusNames.push(focus.name);
					if (!existing.focusTitles.includes(focus.title)) existing.focusTitles.push(focus.title);
					existing.evidence.push(...evidence);
				} else {
					bySlug.set(slug, {
						slug,
						name: item,
						category: group.category,
						focusNames: [focus.name],
						focusTitles: [focus.title],
						summary:
							language === 'en'
								? `${item} is part of my professional toolkit. This skill connects with the roles and responsibilities documented in my CV, rather than presenting it as an isolated keyword.`
								: `${item} forma parte de mi práctica profesional. Esta ficha la conecta con los puestos y responsabilidades documentados en mi CV, en lugar de presentarla como una palabra clave aislada.`,
						narrative: '',
						evidence
					});
				}
			}
		}
	}
	for (const profile of bySlug.values()) {
		const unique = new Map<string, SkillEvidence>();
		for (const item of profile.evidence) {
			const key = [item.experience.company, item.experience.position, item.experience.period].join(
				'|'
			);
			if (!unique.has(key) || item.relevance === 'direct') unique.set(key, item);
		}
		profile.evidence = [...unique.values()];
		const direct = profile.evidence.filter((item) => item.relevance === 'direct').slice(0, 3);
		const selected = direct.length ? direct : profile.evidence.slice(0, 2);
		if (language === 'en') {
			profile.narrative = direct.length
				? `In my professional experience, ${profile.name} has been applied through responsibilities such as ${selected.map((item) => `${item.experience.position} at ${item.experience.company}`).join('; ')}. The role descriptions below show the work context documented in my CV.`
				: `My CV lists ${profile.name} among the capabilities in ${profile.focusTitles.join(', ')}, but does not name it explicitly in the role descriptions. I therefore present the related roles as professional context, not as direct proof of a specific implementation.`;
		} else {
			profile.narrative = direct.length
				? `En mi experiencia profesional, ${profile.name} aparece aplicada en responsabilidades como ${selected.map((item) => `${item.experience.position} en ${item.experience.company}`).join('; ')}. Las descripciones de estos puestos muestran el contexto de trabajo documentado en mi CV.`
				: `Mi CV incluye ${profile.name} entre las capacidades de ${profile.focusTitles.join(', ')}, pero no la menciona literalmente en las descripciones de los puestos. Por eso presento esas funciones como contexto profesional relacionado, no como prueba directa de una implementación concreta.`;
		}
		const stories = content?.skillStories ?? skillStories;
		const authored = stories[profile.slug]?.[language];
		if (authored) profile.narrative = authored;
	}
	return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, language));
}
export function getSkillProfiles(content?: PortfolioContent | null): SkillProfile[] {
	return buildProfiles(lang.current === 'en' ? 'en' : 'es', content);
}
export function getSkillProfile(
	slug: string,
	content?: PortfolioContent | null
): SkillProfile | undefined {
	const current = getSkillProfiles(content).find((skill) => skill.slug === slug);
	if (current) return current;
	const alternate = buildProfiles(lang.current === 'en' ? 'es' : 'en', content);
	return alternate.find((skill) => skill.slug === slug);
}
export function getSkillProfileEntries(content?: PortfolioContent | null): { slug: string }[] {
	const all = [...buildProfiles('es', content), ...buildProfiles('en', content)];
	return [...new Set(all.map((skill) => skill.slug))].map((slug) => ({ slug }));
}
export function getExperienceGroups(content?: PortfolioContent | null): {
	focus: Focus;
	experiences: Experience[];
}[] {
	return dataFor(lang.current === 'en' ? 'en' : 'es', content)
		.focuses.map((focus) => ({ focus, experiences: focus.experiences ?? [] }))
		.filter((group) => group.experiences.length > 0);
}
export function getSkillCategories(content?: PortfolioContent | null): string[] {
	return [...new Set(getSkillProfiles(content).map((skill) => skill.category))];
}
