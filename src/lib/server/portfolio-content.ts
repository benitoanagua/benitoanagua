import { parse } from 'toml';
import type { CVData } from '$lib/types/CV';
import type { SiteData } from '$lib/types/Site';
import {
	LOCALES,
	type CvDocument,
	type Locale,
	type PortfolioContent,
	type PortfolioContentResult
} from '$lib/types/Portfolio';
import { skillStories } from '$lib/data/skill-stories';
import cvEs from '$lib/data/cv.es.toml?raw';
import cvEn from '$lib/data/cv.en.toml?raw';
import siteEs from '$lib/data/site.es.toml?raw';
import siteEn from '$lib/data/site.en.toml?raw';

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

/** Content assembled from the bundled TOML/TS sources (pre-migration fallback). */
function fallbackPortfolioContent(): PortfolioContent {
	const cvRaw = { es: cvEs, en: cvEn } as const;
	const siteRaw = { es: siteEs, en: siteEn } as const;
	const content: PortfolioContent = {
		site: {} as Record<Locale, SiteData>,
		cv: {} as Record<Locale, CVData>,
		skillStories: {}
	};
	for (const locale of LOCALES) {
		content.cv[locale] = parse(cvRaw[locale]) as CVData;
		content.site[locale] = parse(siteRaw[locale]) as SiteData;
	}
	content.skillStories = skillStories;
	return content;
}

function fallbackResult(): PortfolioContentResult {
	return { content: fallbackPortfolioContent(), source: 'fallback' };
}

function assembleContent(rows: ContentRow[]): PortfolioContent | null {
	const byKey = new Map<string, unknown>();
	for (const row of rows) {
		if (!LOCALES.includes(row.locale as Locale)) continue;
		const guard = CONTENT_GUARDS[row.content_key];
		if (!guard) continue;
		const payload = parseJson(row.payload_json);
		if (payload === undefined || !guard(payload)) return null;
		byKey.set(`${row.locale}:${row.content_key}`, payload);
	}
	if (byKey.size !== LOCALES.length * 3) return null;

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
 * Resolves the D1 binding. `platform.env` getters throw for prerenderable
 * routes while the Cloudflare emulation is active (build prerender and
 * `vite dev`), so access is guarded and any failure degrades to `undefined`.
 */
function resolveDb(platform?: App.Platform) {
	try {
		return platform?.env?.DB;
	} catch (error) {
		// Expected for prerenderable routes while the Cloudflare emulation is
		// active; anything else is logged without secrets.
		if (!(error instanceof Error) || !error.message.includes('prerenderable')) {
			console.warn('[portfolio-content] D1 binding unavailable:', error);
		}
		return undefined;
	}
}

/**
 * Loads all localized portfolio content. Uses the D1 `DB` binding when
 * available (Cloudflare runtime); otherwise falls back to the bundled
 * TOML/TS sources so prerendered pages, `vite dev` without a binding and
 * transient D1 failures keep working.
 */
export async function loadPortfolioContent(
	platform?: App.Platform
): Promise<PortfolioContentResult> {
	const db = resolveDb(platform);
	if (!db) return fallbackResult();
	try {
		const { results } = await db
			.prepare('SELECT locale, content_key, payload_json FROM portfolio_content')
			.all<ContentRow>();
		const content = assembleContent(results ?? []);
		if (content) return { content, source: 'd1' };
		console.warn('[portfolio-content] D1 payload failed validation; using TOML fallback');
		return fallbackResult();
	} catch (error) {
		console.warn('[portfolio-content] D1 read failed; using TOML fallback:', error);
		return fallbackResult();
	}
}

/** Fallback CV document list, mirroring the pre-migration hardcoded page data. */
export const CV_DOCUMENTS_FALLBACK: CvDocument[] = [
	{
		key: 'business-analyst',
		label: 'Analista de Aplicaciones de Negocio',
		publicPath: '/cv/BenitoAnagua_AnalistaAplicaciones_2026_ES.pdf',
		mimeType: 'application/pdf',
		sortOrder: 1
	},
	{
		key: 'digital-design-instructor',
		label: 'Docente de Diseño Digital',
		publicPath: '/cv/BenitoAnagua_DocenteDiseno_2026_ES.pdf',
		mimeType: 'application/pdf',
		sortOrder: 2
	},
	{
		key: 'full-stack-developer',
		label: 'Senior Full Stack Developer',
		publicPath: '/cv/BenitoAnagua_FullStackSenior_2026_ES.pdf',
		mimeType: 'application/pdf',
		sortOrder: 3
	},
	{
		key: 'product-designer',
		label: 'Product Designer',
		publicPath: '/cv/BenitoAnagua_ProductDesigner_2026_ES.pdf',
		mimeType: 'application/pdf',
		sortOrder: 4
	}
];

/**
 * Loads current CV document metadata per locale. Documents seeded only for
 * `es` are reused for `en` (the PDFs themselves are Spanish).
 */
export async function loadCvDocuments(
	platform?: App.Platform
): Promise<Record<Locale, CvDocument[]>> {
	const fallback = { es: CV_DOCUMENTS_FALLBACK, en: CV_DOCUMENTS_FALLBACK };
	const db = resolveDb(platform);
	if (!db) return fallback;
	try {
		const { results } = await db
			.prepare(
				`SELECT locale, document_key, label, public_path, mime_type, sort_order
				 FROM portfolio_cv_documents
				 WHERE is_current = 1
				 ORDER BY locale, sort_order`
			)
			.all<DocumentRow>();
		const documents = {} as Record<Locale, CvDocument[]>;
		for (const locale of LOCALES) documents[locale] = [];
		for (const row of results ?? []) {
			if (!LOCALES.includes(row.locale as Locale)) continue;
			if (
				typeof row.document_key !== 'string' ||
				typeof row.label !== 'string' ||
				typeof row.public_path !== 'string'
			) {
				continue;
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
			if (documents[locale].length === 0) documents[locale] = CV_DOCUMENTS_FALLBACK;
		}
		return documents;
	} catch (error) {
		console.warn('[portfolio-content] D1 documents read failed; using fallback:', error);
		return fallback;
	}
}
