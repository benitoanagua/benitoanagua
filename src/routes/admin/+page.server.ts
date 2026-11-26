import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/admin-access';

const LOCALES = ['es', 'en'] as const;
const CONTENT_KEYS = ['cv', 'site', 'skill_stories'] as const;
type Locale = (typeof LOCALES)[number];
type ContentKey = (typeof CONTENT_KEYS)[number];

interface ContentRow {
	locale: Locale;
	content_key: ContentKey;
	payload_json: string;
	updated_at: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidPayload(key: ContentKey, value: unknown): boolean {
	if (!isRecord(value)) return false;
	if (key === 'cv') {
		return isRecord(value.personal) && typeof value.personal.name === 'string' &&
			Array.isArray(value.education) && Array.isArray(value.focuses);
	}
	if (key === 'site') {
		return isRecord(value.meta) && typeof value.meta.tagline === 'string' &&
			typeof value.meta.description === 'string' && isRecord(value.nav) &&
			isRecord(value.home) && isRecord(value.footer);
	}
	return Object.values(value).every((item) => typeof item === 'string');
}

function getSelection(url: URL): { locale: Locale; key: ContentKey } {
	const locale = url.searchParams.get('locale');
	const key = url.searchParams.get('key');
	return {
		locale: locale === 'en' ? 'en' : 'es',
		key: CONTENT_KEYS.includes(key as ContentKey) ? (key as ContentKey) : 'site'
	};
}

export const load: PageServerLoad = async ({ request, platform, url }) => {
	await requireAdmin(request, platform?.env);
	const db = platform?.env?.DB;
	if (!db) error(503, 'The D1 binding DB is unavailable.');

	const selection = getSelection(url);
	const row = await db
		.prepare(
			'SELECT locale, content_key, payload_json, updated_at FROM portfolio_content WHERE locale = ? AND content_key = ?'
		)
		.bind(selection.locale, selection.key)
		.first<ContentRow>();
	if (!row) error(404, 'The selected content document does not exist in D1.');

	return {
		selection,
		contentJson: JSON.stringify(JSON.parse(row.payload_json), null, 2),
		updatedAt: row.updated_at
	};
};

export const actions: Actions = {
	save: async ({ request, platform }) => {
		await requireAdmin(request, platform?.env);
		const db = platform?.env?.DB;
		if (!db) error(503, 'The D1 binding DB is unavailable.');

		const form = await request.formData();
		const locale = form.get('locale');
		const key = form.get('key');
		const raw = form.get('content');
		if (
			(locale !== 'es' && locale !== 'en') ||
			!CONTENT_KEYS.includes(key as ContentKey) ||
			typeof raw !== 'string'
		) {
			return fail(400, { message: 'Invalid content document selection.' });
		}

		let payload: unknown;
		try {
			payload = JSON.parse(raw);
		} catch {
			return fail(400, { message: 'The content must be valid JSON.' });
		}
		if (!isValidPayload(key as ContentKey, payload)) {
			return fail(400, {
				message: 'The JSON does not match the expected structure for this document.'
			});
		}

		await db
			.prepare(
				`INSERT INTO portfolio_content (locale, content_key, payload_json, source_path)
				 VALUES (?, ?, ?, 'admin-dashboard')
				 ON CONFLICT(locale, content_key) DO UPDATE SET
				 payload_json = excluded.payload_json,
				 source_path = excluded.source_path,
				 updated_at = CURRENT_TIMESTAMP`
			)
			.bind(locale, key, JSON.stringify(payload))
			.run();

		return { success: true, message: 'Saved to D1. Published content is read by the site at request time.' };
	}
};
