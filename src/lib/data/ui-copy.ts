import type { Language } from '$lib/state/lang.svelte';

/**
 * Textos de interfaz de las páginas de contenido (habilidades, experiencia, CV, error).
 * Los textos globales (menú, portada, pie) viven en site.{es,en}.toml y los de proyectos en projects-copy.ts.
 */
export interface UiCopy {
	skills: {
		eyebrow: string;
		title: string;
		intro: string;
		summary: (skills: number, categories: number) => string;
		roles: (n: number) => string;
		open: string;
		searchLabel: string;
		searchPlaceholder: string;
		categoriesLabel: string;
		results: (n: number) => string;
		noResults: (q: string) => string;
		clear: string;
		pageTitle: string;
	};
	skillDetail: {
		eyebrow: string;
		back: string;
		evidenceEyebrow: string;
		evidenceTitle: string;
		direct: string;
		context: string;
		note: string;
		related: string;
		nextTitle: string;
		nextText: string;
		cv: string;
		contact: string;
		titleSuffix: string;
		categoryLabel: string;
		areasLabel: string;
		noteLabel: string;
	};
	experience: {
		eyebrow: string;
		title: string;
		intro: string;
		area: string;
		skillsHere: string;
		allSkills: string;
		pageTitle: string;
	};
	cv: {
		eyebrow: string;
		title: string;
		intro: string;
		current: string;
		download: string;
		explore: string;
		languageNote: string | null;
		languageNoteLabel: string;
	};
	projects: { eyebrow: string; detailEyebrow: string };
	error: {
		notFoundTitle: string;
		notFoundText: string;
		genericTitle: string;
		genericText: string;
		home: string;
	};
}

const es: UiCopy = {
	skills: {
		eyebrow: 'Capacidades y evidencia profesional',
		title: 'Habilidades conectadas con experiencia.',
		intro:
			'Explora cada capacidad a través de los puestos donde la desarrollé, las responsabilidades que asumí y el contexto profesional que la respalda.',
		summary: (s, c) => `${s} habilidades en ${c} categorías`,
		roles: (n) => (n === 1 ? '1 área profesional' : `${n} áreas profesionales`),
		open: 'Ver ficha de habilidad',
		searchLabel: 'Buscar habilidad',
		searchPlaceholder: 'Nombre de la habilidad',
		categoriesLabel: 'Ir a una categoría',
		results: (n) => (n === 1 ? '1 habilidad encontrada' : `${n} habilidades encontradas`),
		noResults: (q) => `Ninguna habilidad coincide con «${q}».`,
		clear: 'Limpiar búsqueda',
		pageTitle: 'Habilidades'
	},
	skillDetail: {
		eyebrow: 'Práctica profesional',
		back: 'Habilidades',
		evidenceEyebrow: 'Experiencia y evidencia',
		evidenceTitle: 'Cómo aparece esta habilidad en mi experiencia',
		direct: 'Mencionada directamente en la descripción del puesto',
		context: 'Contexto profesional relacionado',
		note: 'Esta ficha se basa en responsabilidades documentadas en mi CV. No revela detalles confidenciales ni atribuye resultados no documentados.',
		related: 'Otras habilidades de esta categoría',
		nextTitle: '¿Qué sigue?',
		nextText: 'Revisa el CV completo o escríbeme si esta experiencia encaja con lo que buscas.',
		cv: 'Ver CV',
		contact: 'Escribirme',
		titleSuffix: 'Habilidades',
		categoryLabel: 'Categoría',
		areasLabel: 'Áreas profesionales',
		noteLabel: 'Nota'
	},
	experience: {
		eyebrow: 'Trayectoria profesional',
		title: 'La experiencia es el contexto de mis habilidades.',
		intro:
			'Una trayectoria que conecta desarrollo de software, diseño de producto, análisis funcional, comunicación visual y docencia.',
		area: 'Área profesional',
		skillsHere: 'Habilidades de esta área',
		allSkills: 'Ver todas las habilidades',
		pageTitle: 'Experiencia profesional'
	},
	cv: {
		eyebrow: 'Documentos',
		title: 'CV y documentos profesionales',
		intro:
			'Descarga el documento que mejor corresponda al puesto o explora las habilidades y la experiencia que lo respaldan.',
		current: 'Documentos PDF vigentes',
		download: 'Descargar PDF',
		explore: 'Explorar habilidades',
		languageNote: null,
		languageNoteLabel: 'Nota'
	},
	projects: { eyebrow: 'Proyectos y trabajo seleccionado', detailEyebrow: 'Proyecto' },
	error: {
		notFoundTitle: 'Esta página no existe',
		notFoundText: 'El enlace puede haber cambiado. Estos son los lugares principales del sitio:',
		genericTitle: 'Algo salió mal',
		genericText: 'No se pudo mostrar esta página. Puedes volver a una sección del sitio:',
		home: 'Ir al inicio'
	}
};

const en: UiCopy = {
	skills: {
		eyebrow: 'Capabilities and professional evidence',
		title: 'Skills, connected to experience.',
		intro:
			'Explore each capability through the roles where I used it, the responsibilities I held, and the professional context behind it.',
		summary: (s, c) => `${s} skills in ${c} categories`,
		roles: (n) => (n === 1 ? '1 work area' : `${n} work areas`),
		open: 'View skill profile',
		searchLabel: 'Search skills',
		searchPlaceholder: 'Skill name',
		categoriesLabel: 'Jump to a category',
		results: (n) => (n === 1 ? '1 skill found' : `${n} skills found`),
		noResults: (q) => `No skill matches “${q}”.`,
		clear: 'Clear search',
		pageTitle: 'Skills'
	},
	skillDetail: {
		eyebrow: 'Professional practice',
		back: 'Skills',
		evidenceEyebrow: 'Experience and evidence',
		evidenceTitle: 'How this skill appears in my experience',
		direct: 'Mentioned directly in the role description',
		context: 'Related professional context',
		note: 'This profile is based on responsibilities documented in my CV. It does not disclose confidential project details or claim unreported results.',
		related: 'Other skills in this category',
		nextTitle: 'What next?',
		nextText: 'Read the full CV, or get in touch if this experience fits what you are looking for.',
		cv: 'View CV',
		contact: 'Contact me',
		titleSuffix: 'Skills',
		categoryLabel: 'Category',
		areasLabel: 'Professional areas',
		noteLabel: 'Note'
	},
	experience: {
		eyebrow: 'Professional career',
		title: 'Experience is the context behind my skills.',
		intro:
			'A professional timeline across software development, product design, functional analysis, visual communication and teaching.',
		area: 'Professional area',
		skillsHere: 'Skills in this area',
		allSkills: 'View all skills',
		pageTitle: 'Professional experience'
	},
	cv: {
		eyebrow: 'Documents',
		title: 'CV and professional documents',
		intro:
			'Download the document that best matches the role, or explore the skills and experience behind it.',
		current: 'Current PDF documents',
		download: 'Download PDF',
		explore: 'Explore skills',
		languageNote: 'The PDF documents are currently available in Spanish only.',
		languageNoteLabel: 'Note'
	},
	projects: { eyebrow: 'Projects and selected work', detailEyebrow: 'Project' },
	error: {
		notFoundTitle: 'This page does not exist',
		notFoundText: 'The link may have changed. These are the main places on the site:',
		genericTitle: 'Something went wrong',
		genericText: 'This page could not be shown. You can go back to a section of the site:',
		home: 'Go to the home page'
	}
};

export function uiCopy(language: Language): UiCopy {
	return language === 'en' ? en : es;
}
