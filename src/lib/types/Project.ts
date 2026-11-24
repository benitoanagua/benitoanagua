export type ProjectArea = 'dev' | 'design' | 'graphic' | 'analysis' | 'games';
export type ProjectStatus = 'wip' | 'done' | 'spec';

export const PROJECT_AREAS: ProjectArea[] = ['dev', 'design', 'graphic', 'analysis', 'games'];

export interface ProjectLinks {
	repo?: string;
	demo?: string;
	case?: string;
}

export interface Project {
	slug: string;
	title: string;
	area: ProjectArea;
	year: string;
	role: string;
	summary: string;
	featured?: boolean;
	status?: ProjectStatus;
	stack: string[];
	skills: string[];
	context?: string;
	highlights: string[];
	result?: string;
	links?: ProjectLinks;
}

export interface ProjectsData {
	projects: Project[];
}
