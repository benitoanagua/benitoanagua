import type { LayoutServerLoad } from './$types';
import { loadSiteData } from '$lib/data/site-loader';
import { getPersonalInfo } from '$lib/data/cv-loader';
import { SITE_URL, OG_IMAGES } from '$lib/config';

export const load: LayoutServerLoad = async ({ url }) => {
	const site = loadSiteData();
	const personal = getPersonalInfo();
	const currentPath = url.pathname;
	const isProduction = !url.hostname.includes('localhost');
	const canonicalUrl = isProduction
		? `${SITE_URL}${currentPath === '/' ? '' : currentPath}`
		: url.toString();

	let pageTitle = personal.name;
	let pageDescription = site.meta.description;
	let pageKeywords = 'professional skills, work experience, software development, product design';

	if (currentPath === '/habilidades' || currentPath.startsWith('/habilidades/')) {
		pageTitle = `Skills & Professional Evidence — ${personal.name}`;
		pageDescription = 'Professional skills connected to responsibilities and roles documented in the CV';
		pageKeywords = 'skills, professional experience, software development, product design, functional analysis';
	} else if (currentPath === '/experiencia') {
		pageTitle = `Professional Experience — ${personal.name}`;
		pageDescription = 'Career history, responsibilities and professional context across software, design, analysis and teaching';
		pageKeywords = 'professional experience, career, software developer, product designer, business analyst, instructor';
	} else if (currentPath === '/cv') {
		pageTitle = `CV & Professional Documents — ${personal.name}`;
		pageDescription = 'Current role-specific curriculum vitae documents';
		pageKeywords = 'CV, resume, curriculum vitae, professional documents';
	}

	return {
		seo: {
			title: pageTitle,
			description: pageDescription,
			keywords: pageKeywords,
			canonical: canonicalUrl,
			ogImage: `${SITE_URL}${OG_IMAGES.default}`,
			author: personal.name,
			email: personal.email
		},
		site
	};
};
