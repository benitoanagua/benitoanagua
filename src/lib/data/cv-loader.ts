import { parse } from 'toml';
import type { CVData } from '$lib/types/CV';
import { lang } from '$lib/state/lang.svelte';
import { portfolioStore } from '$lib/state/portfolio.svelte';
import cvEs from './cv.es.toml?raw';
import cvEn from './cv.en.toml?raw';

export function loadCVData(): CVData {
	const localized = portfolioStore.content?.cv[lang.current];
	if (localized) return localized;
	const raw = lang.current === 'en' ? cvEn : cvEs;
	return parse(raw) as CVData;
}

export function getPersonalInfo() {
	const cvData = loadCVData();
	return cvData.personal;
}

export function getEducation() {
	const cvData = loadCVData();
	return cvData.education;
}
