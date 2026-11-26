import { PROJECT_AREAS, type Project, type ProjectStatus } from '$lib/types/Project';

export const PROJECT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PROJECT_STATUSES: ProjectStatus[] = ['wip', 'done', 'spec'];
const PROJECT_LINK_KEYS = ['repo', 'demo', 'case'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isOptionalString(value: unknown): boolean {
	return value === undefined || typeof value === 'string';
}

function isProjectLinks(value: unknown): boolean {
	if (value === undefined) return true;
	if (!isRecord(value)) return false;
	const keys = Object.keys(value);
	return (
		keys.every((key) => (PROJECT_LINK_KEYS as readonly string[]).includes(key)) &&
		PROJECT_LINK_KEYS.every((key) => isOptionalString(value[key]))
	);
}

export function isProjectSlug(value: unknown): value is string {
	return typeof value === 'string' && PROJECT_SLUG_PATTERN.test(value);
}

/**
 * Validates a localized project document. Admin saves and public reads share
 * this function so a payload accepted by the editor cannot be rejected by the
 * public loader (or vice versa).
 *
 * `expectedSlug` is used by the public loader to ensure the document inside
 * the row matches the row's primary key.
 */
export function parseProjectPayload(raw: unknown, expectedSlug?: string): Project | null {
	if (!isRecord(raw)) return null;
	const p = raw;
	if (
		!isProjectSlug(p.slug) ||
		(expectedSlug !== undefined && p.slug !== expectedSlug) ||
		typeof p.title !== 'string' ||
		!p.title.trim() ||
		typeof p.area !== 'string' ||
		!PROJECT_AREAS.includes(p.area as Project['area']) ||
		typeof p.year !== 'string' ||
		typeof p.role !== 'string' ||
		typeof p.summary !== 'string' ||
		!isStringArray(p.stack) ||
		!isStringArray(p.skills) ||
		!isStringArray(p.highlights) ||
		(p.status !== undefined && !PROJECT_STATUSES.includes(p.status as ProjectStatus)) ||
		(p.featured !== undefined && typeof p.featured !== 'boolean') ||
		!isOptionalString(p.context) ||
		!isOptionalString(p.result) ||
		!isProjectLinks(p.links)
	) {
		return null;
	}
	return p as unknown as Project;
}

export type ParsedProjectDocuments =
	| { ok: true; es: Project; en: Project }
	| { ok: false; message: string };

/**
 * Parses and validates the two JSON textareas submitted by the admin editor.
 * The error messages are intentionally generic: they never echo payload data
 * or parser internals back to the browser.
 */
export function parseProjectDocuments(esRaw: string, enRaw: string): ParsedProjectDocuments {
	let esValue: unknown;
	let enValue: unknown;
	try {
		esValue = JSON.parse(esRaw);
		enValue = JSON.parse(enRaw);
	} catch {
		return { ok: false, message: 'Both project documents must be valid JSON.' };
	}

	const es = parseProjectPayload(esValue);
	const en = parseProjectPayload(enValue);
	if (!es || !en || es.slug !== en.slug) {
		return { ok: false, message: 'Invalid project structure or localized slugs do not match.' };
	}
	if (
		es.area !== en.area ||
		es.year !== en.year ||
		JSON.stringify(es.stack) !== JSON.stringify(en.stack) ||
		JSON.stringify(es.skills) !== JSON.stringify(en.skills)
	) {
		return { ok: false, message: 'Area, year, stack and skills must match across locales.' };
	}
	return { ok: true, es, en };
}
