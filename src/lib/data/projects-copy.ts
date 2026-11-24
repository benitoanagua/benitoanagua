import type { Language } from '$lib/state/lang.svelte';
import type { ProjectArea, ProjectStatus } from '$lib/types/Project';

export interface ProjectsCopy {
	title: string;
	lead: string;
	filterAll: string;
	filterAria: string;
	count: string;
	empty: string;
	role: string;
	year: string;
	status: string;
	stack: string;
	skills: string;
	context: string;
	highlights: string;
	result: string;
	links: string;
	repo: string;
	demo: string;
	case: string;
	back: string;
	related: string;
	featuredTitle: string;
	featuredCta: string;
	skillProjectsTitle: string;
	skillProjectsLead: string;
	homeCard: string;
	areas: Record<ProjectArea, string>;
	statuses: Record<ProjectStatus, string>;
}

const es: ProjectsCopy = {
	title: 'Proyectos',
	lead: 'Trabajo propio, independiente y profesional. Cada proyecto enlaza con las habilidades que aplicó.',
	filterAll: 'Todos',
	filterAria: 'Filtrar proyectos por área',
	count: 'proyectos',
	empty: 'Todavía no hay proyectos en esta área.',
	role: 'Rol',
	year: 'Año',
	status: 'Estado',
	stack: 'Stack',
	skills: 'Habilidades aplicadas',
	context: 'Contexto',
	highlights: 'Qué hice',
	result: 'Resultado',
	links: 'Enlaces',
	repo: 'Código',
	demo: 'Demo',
	case: 'Caso de estudio',
	back: 'Todos los proyectos',
	related: 'Otros proyectos del área',
	featuredTitle: 'Proyectos destacados',
	featuredCta: 'Ver todos los proyectos',
	skillProjectsTitle: 'Proyectos donde la apliqué',
	skillProjectsLead: 'Evidencia concreta además de la experiencia laboral.',
	homeCard: 'Explora el trabajo propio: apps, sistemas de diseño y juegos',
	areas: { dev: 'Desarrollo', design: 'Diseño', graphic: 'Gráfico', analysis: 'Análisis', games: 'Juegos' },
	statuses: { wip: 'En desarrollo', done: 'Terminado', spec: 'En especificación' }
};

const en: ProjectsCopy = {
	title: 'Projects',
	lead: 'Personal, independent and professional work. Each project links to the skills it applied.',
	filterAll: 'All',
	filterAria: 'Filter projects by area',
	count: 'projects',
	empty: 'No projects in this area yet.',
	role: 'Role',
	year: 'Year',
	status: 'Status',
	stack: 'Stack',
	skills: 'Skills applied',
	context: 'Context',
	highlights: 'What I did',
	result: 'Result',
	links: 'Links',
	repo: 'Code',
	demo: 'Demo',
	case: 'Case study',
	back: 'All projects',
	related: 'More projects in this area',
	featuredTitle: 'Featured projects',
	featuredCta: 'See all projects',
	skillProjectsTitle: 'Projects where I applied it',
	skillProjectsLead: 'Concrete evidence beyond work experience.',
	homeCard: 'Explore personal work: apps, design systems and games',
	areas: { dev: 'Development', design: 'Design', graphic: 'Graphic', analysis: 'Analysis', games: 'Games' },
	statuses: { wip: 'In progress', done: 'Completed', spec: 'In specification' }
};

export function projectsCopy(language: Language): ProjectsCopy {
	return language === 'en' ? en : es;
}
