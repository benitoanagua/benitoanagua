import { lang, type Language } from '$lib/state/lang.svelte';
import type { Pathname } from '$app/types';

export interface NavItem {
	label: string;
	href: Pathname;
}

/** Navegación principal única (antes estaba repetida en cada página). */
export function getNavItems(language: Language = lang.current): NavItem[] {
	return language === 'en'
		? [
				{ label: 'Skills', href: '/habilidades' },
				{ label: 'Projects', href: '/proyectos' },
				{ label: 'Experience', href: '/experiencia' },
				{ label: 'CV', href: '/cv' }
			]
		: [
				{ label: 'Habilidades', href: '/habilidades' },
				{ label: 'Proyectos', href: '/proyectos' },
				{ label: 'Experiencia', href: '/experiencia' },
				{ label: 'CV', href: '/cv' }
			];
}
