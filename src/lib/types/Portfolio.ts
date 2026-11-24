import type { CVData } from './CV';
import type { SiteData } from './Site';

export type Locale = 'es' | 'en';
export const LOCALES: readonly Locale[] = ['es', 'en'];

/** Portfolio content for every locale, as stored in D1 `portfolio_content`. */
export interface PortfolioContent {
	site: Record<Locale, SiteData>;
	cv: Record<Locale, CVData>;
	skillStories: Record<string, Partial<Record<Locale, string>>>;
}

export type PortfolioContentSource = 'd1' | 'fallback';

/**
 * Minimal structural type for the Cloudflare D1 binding. Avoids a hard
 * dependency on `@cloudflare/workers-types`, which is only a transitive dep.
 */
export interface D1DatabaseLike {
	prepare(query: string): {
		bind(...values: unknown[]): {
			all<T = unknown>(): Promise<{ results: T[] }>;
		};
		all<T = unknown>(): Promise<{ results: T[] }>;
	};
}

export interface PortfolioContentResult {
	content: PortfolioContent;
	source: PortfolioContentSource;
}

/** Public CV document metadata (binary assets stay in static/R2). */
export interface CvDocument {
	key: string;
	label: string;
	publicPath: string;
	mimeType: string;
	sortOrder: number;
}
