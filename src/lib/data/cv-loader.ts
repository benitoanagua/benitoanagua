import type { CVData } from '$lib/types/CV';
import type { PortfolioContent } from '$lib/types/Portfolio';
import { lang } from '$lib/state/lang.svelte';

export function loadCVData(content: PortfolioContent): CVData {
	return content.cv[lang.current];
}

export function getPersonalInfo(content: PortfolioContent) {
	return loadCVData(content).personal;
}

export function getEducation(content: PortfolioContent) {
	return loadCVData(content).education;
}
