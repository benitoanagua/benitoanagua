/**
 * Misma convención de slug que `skill-profiles.ts` (habilidades).
 * Mantenerlas idénticas: los proyectos enlazan a /habilidades/<slug> con ella.
 */
export function slugify(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
