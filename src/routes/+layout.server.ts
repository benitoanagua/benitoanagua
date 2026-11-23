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

	// Determine page-specific metadata
	let pageTitle = personal.name;
	let pageDescription = site.meta.description;
	let pageKeywords = 'portfolio, design, development, graphic design, interdisciplinary';

	if (currentPath === '/habilidades' || currentPath.startsWith('/habilidades/')) {
		pageTitle = `Skills & Professional Evidence — ${personal.name}`;
		pageDescription = 'Professional skills connected to responsibilities and roles documented in the CV';
		pageKeywords = 'skills, professional experience, software development, product design, functional analysis';
	} else if (currentPath === '/experiencia') {
		pageTitle = `Professional Experience — ${personal.name}`;
		pageDescription = 'Career history, responsibilities and professional context across software, design, analysis and teaching';
		pageKeywords = 'professional experience, career, software developer, product designer, business analyst, instructor';
	} else if (currentPath === '/cv') {
		pageTitle = `CV & Professional Profiles — ${personal.name}`;
		pageDescription = 'Curriculum vitae and professional profile documents';
		pageKeywords = 'CV, resume, curriculum vitae, professional profiles';
	} else if (currentPath.includes('/developer')) {
		pageTitle = `Software Developer — ${personal.name}`;
		pageDescription =
			'Software development projects, technical expertise, and professional experience';
		pageKeywords = 'developer, web development, software engineer, typescript, svelte, fullstack';
	} else if (currentPath.includes('/designer')) {
		pageTitle = `UX/UI Designer — ${personal.name}`;
		pageDescription = 'Design systems, user experience, and interface design projects';
		pageKeywords = 'designer, ux, ui, design, user experience, interface design';
	} else if (currentPath.includes('/graphic')) {
		pageTitle = `Graphic Designer — ${personal.name}`;
		pageDescription = 'Visual design, branding, and creative projects';
		pageKeywords = 'graphic designer, visual design, branding, creative, visual identity';
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
