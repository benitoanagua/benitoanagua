import type { CVData } from '$lib/types/CV';
import type { SiteData } from '$lib/types/Site';
import { LOCALES, type CvDocument, type Locale, type PortfolioContent } from '$lib/types/Portfolio';

interface ContentRow {
	locale: string;
	content_key: string;
	payload_json: string;
}

interface DocumentRow {
	locale: string;
	document_key: string;
	label: string;
	public_path: string;
	mime_type: string;
	sort_order: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJson(raw: string): unknown {
	try {
		return JSON.parse(raw);
	} catch {
		return undefined;
	}
}

function isCVData(value: unknown): value is CVData {
	return (
		isRecord(value) &&
		isRecord(value.personal) &&
		typeof value.personal.name === 'string' &&
		Array.isArray(value.education) &&
		Array.isArray(value.focuses)
	);
}

function isSiteData(value: unknown): value is SiteData {
	return (
		isRecord(value) &&
		isRecord(value.meta) &&
		typeof value.meta.tagline === 'string' &&
		typeof value.meta.description === 'string' &&
		isRecord(value.nav) &&
		isRecord(value.home) &&
		isRecord(value.footer)
	);
}

function isSkillStories(value: unknown): value is Record<string, string> {
	return isRecord(value) && Object.values(value).every((v) => typeof v === 'string');
}

const CONTENT_GUARDS: Record<string, (value: unknown) => boolean> = {
	cv: isCVData,
	site: isSiteData,
	skill_stories: isSkillStories
};

function assembleContent(rows: ContentRow[]): PortfolioContent {
	const byKey = new Map<string, unknown>();
	for (const row of rows) {
		if (!LOCALES.includes(row.locale as Locale)) continue;
		const guard = CONTENT_GUARDS[row.content_key];
		if (!guard) continue;
		const payload = parseJson(row.payload_json);
		if (payload === undefined || !guard(payload)) {
			throw new Error(
				`[portfolio-content] Invalid or unparsable payload for ${row.locale}:${row.content_key}`
			);
		}
		byKey.set(`${row.locale}:${row.content_key}`, payload);
	}
	if (byKey.size !== LOCALES.length * 3) {
		throw new Error(
			`[portfolio-content] Expected ${LOCALES.length * 3} content documents in D1, found ${byKey.size}`
		);
	}

	const content: PortfolioContent = {
		site: {} as Record<Locale, SiteData>,
		cv: {} as Record<Locale, CVData>,
		skillStories: {}
	};
	for (const locale of LOCALES) {
		content.cv[locale] = byKey.get(`${locale}:cv`) as CVData;
		content.site[locale] = byKey.get(`${locale}:site`) as SiteData;
		const stories = byKey.get(`${locale}:skill_stories`) as Record<string, string>;
		for (const [slug, text] of Object.entries(stories)) {
			(content.skillStories[slug] ??= {})[locale] = text;
		}
	}
	return content;
}

/**
 * Resolves the D1 binding. `platform.env` getters can throw outside the
 * Cloudflare runtime; any failure is treated as "binding unavailable".
 */
function resolveDb(platform?: App.Platform) {
	try {
		return platform?.env?.DB;
	} catch {
		return undefined;
	}
}

function requireDb(platform?: App.Platform) {
	const db = resolveDb(platform);
	if (!db) {
		throw new Error('[portfolio-content] D1 binding DB is unavailable.');
	}
	return db;
}

/**
 * Loads all localized portfolio content from D1. There is no bundled
 * fallback: a missing binding, query failure or invalid payload is a hard
 * error so a misconfigured database cannot silently serve stale content.
 */
export async function loadPortfolioContent(platform?: App.Platform): Promise<PortfolioContent> {
	const db = requireDb(platform);
	try {
		const { results } = await db
			.prepare('SELECT locale, content_key, payload_json FROM portfolio_content')
			.all<ContentRow>();
		return assembleContent(results ?? []);
	} catch (error) {
		if (error instanceof Error && error.message.startsWith('[portfolio-content]')) throw error;
		throw new Error(`[portfolio-content] D1 read failed: ${String(error)}`);
	}
}

/**
 * Loads current CV document metadata per locale. Documents seeded only for
 * `es` are reused for `en` (the PDFs themselves are Spanish); a locale with
 * no current rows inherits the other locale's list.
 */
export async function loadCvDocuments(
	platform?: App.Platform
): Promise<Record<Locale, CvDocument[]>> {
	const db = requireDb(platform);
	let results: DocumentRow[];
	try {
		const response = await db
			.prepare(
				`SELECT locale, document_key, label, public_path, mime_type, sort_order
				 FROM portfolio_cv_documents
				 WHERE is_current = 1
				 ORDER BY locale, sort_order`
			)
			.all<DocumentRow>();
		results = response.results ?? [];
	} catch (error) {
		throw new Error(`[portfolio-content] D1 documents read failed: ${String(error)}`);
	}

	const documents = {} as Record<Locale, CvDocument[]>;
	for (const locale of LOCALES) documents[locale] = [];
	for (const row of results) {
		if (!LOCALES.includes(row.locale as Locale)) continue;
		if (
			typeof row.document_key !== 'string' ||
			typeof row.label !== 'string' ||
			typeof row.public_path !== 'string'
		) {
			throw new Error(
				`[portfolio-content] Invalid CV document row for ${String(row.locale)}:${String(row.document_key)}`
			);
		}
		documents[row.locale as Locale].push({
			key: row.document_key,
			label: row.label,
			publicPath: row.public_path,
			mimeType: typeof row.mime_type === 'string' ? row.mime_type : 'application/pdf',
			sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0
		});
	}
	for (const locale of LOCALES) {
		if (documents[locale].length === 0) {
			const other = LOCALES.find((l) => l !== locale)!;
			if (documents[other].length === 0) {
				throw new Error('[portfolio-content] No current CV documents in D1.');
			}
			documents[locale] = documents[other];
		}
	}
	return documents;
}
