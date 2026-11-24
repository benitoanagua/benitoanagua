import { parse } from 'toml';
import type { CVData } from '$lib/types/CV';
import type { PortfolioContent } from '$lib/types/Portfolio';
import { lang } from '$lib/state/lang.svelte';
import cvEs from './cv.es.toml?raw';
import cvEn from './cv.en.toml?raw';

export function loadCVData(content?: PortfolioContent | null): CVData {
	const localized = content?.cv[lang.current];
	if (localized) return localized;
	const raw = lang.current === 'en' ? cvEn : cvEs;
	return parse(raw) as CVData;
}

export function getPersonalInfo(content?: PortfolioContent | null) {
	const cvData = loadCVData(content);
	return cvData.personal;
}

export function getEducation(content?: PortfolioContent | null) {
	const cvData = loadCVData(content);
	return cvData.education;
}
