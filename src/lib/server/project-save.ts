import type { D1DatabaseLike } from '$lib/types/Portfolio';
import { isProjectSlug, parseProjectDocuments } from './project-payload';

export type SlugChangeResult = { ok: true } | { ok: false; status: 400 | 409; message: string };

/**
 * The slug is the primary key of `portfolio_projects` and the public project
 * URL. Renaming it through the editor would either insert a duplicate row or
 * leave the original record behind, so the save action treats it as immutable
 * for existing projects.
 *
 * `originalSlug` is the slug the editor loaded; it is empty when the form is
 * creating a new project. `existing` reports whether the target slug already
 * exists in D1.
 */
export function validateSlugChange({
	originalSlug,
	nextSlug,
	existing
}: {
	originalSlug: string;
	nextSlug: string;
	existing: boolean;
}): SlugChangeResult {
	if (originalSlug) {
		if (!existing) {
			return {
				ok: false,
				status: 409,
				message: 'The project no longer exists in D1. Reload the page before saving.'
			};
		}
		if (originalSlug !== nextSlug) {
			return {
				ok: false,
				status: 400,
				message: 'The slug of an existing project cannot be changed. Create a new project instead.'
			};
		}
		return { ok: true };
	}

	if (existing) {
		return {
			ok: false,
			status: 409,
			message: 'A project with this slug already exists. Select it from the list to edit it.'
		};
	}
	return { ok: true };
}

/** Invalid or missing order values fall back to the end of the list. */
export function normalizeSortOrder(value: FormDataEntryValue | null): number {
	if (value === null || (typeof value === 'string' && value.trim() === '')) return 9999;
	const order = Number(value);
	return Number.isInteger(order) && order >= 0 ? order : 9999;
}

export type SaveProjectResult =
	| { ok: true; message: string; slug: string }
	| { ok: false; status: 400 | 409; message: string };

/**
 * Validates and persists one project save. Keeping the D1 work here (instead
 * of in the route action) lets tests exercise validation-before-write with a
 * mock database while the action only handles auth and form extraction.
 */
export async function saveProject(db: D1DatabaseLike, form: FormData): Promise<SaveProjectResult> {
	const esRaw = form.get('content_es');
	const enRaw = form.get('content_en');
	const originalSlugRaw = form.get('original_slug');
	const published = form.get('is_published') === '1' ? 1 : 0;

	if (typeof esRaw !== 'string' || typeof enRaw !== 'string') {
		return {
			ok: false,
			status: 400,
			message: 'Both Spanish and English JSON documents are required.'
		};
	}
	if (typeof originalSlugRaw !== 'string') {
		return { ok: false, status: 400, message: 'The original project slug is required.' };
	}

	const originalSlug = originalSlugRaw.trim();
	if (originalSlug && !isProjectSlug(originalSlug)) {
		return { ok: false, status: 400, message: 'Invalid original project slug.' };
	}
	const parsed = parseProjectDocuments(esRaw, enRaw);
	if (!parsed.ok) {
		return { ok: false, status: 400, message: parsed.message };
	}
	const { es, en } = parsed;

	const targetSlug = originalSlug || es.slug;
	const existing = await db
		.prepare('SELECT slug FROM portfolio_projects WHERE slug = ?')
		.bind(targetSlug)
		.first<{ slug: string }>();
	const slugDecision = validateSlugChange({
		originalSlug,
		nextSlug: es.slug,
		existing: Boolean(existing)
	});
	if (!slugDecision.ok) return slugDecision;

	const sortOrder = normalizeSortOrder(form.get('sort_order'));
	await db
		.prepare(
			`INSERT INTO portfolio_projects
			(slug, area, year, featured, status, sort_order, content_es, content_en, is_published)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(slug) DO UPDATE SET area=excluded.area, year=excluded.year,
			featured=excluded.featured, status=excluded.status, sort_order=excluded.sort_order,
			content_es=excluded.content_es, content_en=excluded.content_en,
			is_published=excluded.is_published, updated_at=CURRENT_TIMESTAMP`
		)
		.bind(
			es.slug,
			es.area,
			es.year,
			es.featured ? 1 : 0,
			es.status ?? null,
			sortOrder,
			JSON.stringify(es),
			JSON.stringify(en),
			published
		)
		.run();

	return { ok: true, slug: es.slug, message: `Project "${es.slug}" saved in D1.` };
}
