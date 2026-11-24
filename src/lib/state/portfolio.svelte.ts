import type { PortfolioContent, PortfolioContentSource } from '$lib/types/Portfolio';

/**
 * Client/server-shared portfolio content loaded from D1 (or the TOML
 * fallback) by the root layout load. The synchronous data loaders read from
 * this store first and fall back to the bundled TOML sources when it is empty
 * (build-time prerendering, `vite dev` without a D1 binding, unit scripts).
 */
class PortfolioStore {
	content = $state<PortfolioContent | null>(null);
	source = $state<PortfolioContentSource | null>(null);
}

export const portfolioStore = new PortfolioStore();
