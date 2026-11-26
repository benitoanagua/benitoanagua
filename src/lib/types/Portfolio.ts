import type { CVData } from './CV';
import type { SiteData } from './Site';

export type Locale = 'es' | 'en';
export const LOCALES: readonly Locale[] = ['es', 'en'];

/** Content documents read from D1 `portfolio_content`. */
export interface PortfolioContent {
	site: Record<Locale, SiteData>;
	cv: Record<Locale, CVData>;
	skillStories: Record<string, Partial<Record<Locale, string>>>;
}

/**
 * Minimal structural types for the Cloudflare D1 binding. Avoids a hard
 * dependency on Cloudflare worker types in the application source.
 */
export interface D1Result<T = unknown> {
	results: T[];
	success?: boolean;
	meta?: Record<string, unknown>;
}

export interface D1PreparedStatementLike {
	bind(...values: unknown[]): D1PreparedStatementLike;
	all<T = unknown>(): Promise<D1Result<T>>;
	first<T = unknown>(columnName?: string): Promise<T | null>;
	run<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1DatabaseLike {
	prepare(query: string): D1PreparedStatementLike;
}

/** Public CV document metadata (binary assets stay in static/R2). */
export interface CvDocument {
	key: string;
	label: string;
	publicPath: string;
	mimeType: string;
	sortOrder: number;
}
