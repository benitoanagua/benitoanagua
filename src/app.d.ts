// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			seo: {
				title: string;
				description: string;
				keywords: string;
				canonical: string;
				ogImage: string;
				author: string;
				email: string;
			};
			site?: import('$lib/types/Site').SiteData;
			focus?: unknown;
			portfolio?: import('$lib/types/Portfolio').PortfolioContent | null;
			portfolioSource?: import('$lib/types/Portfolio').PortfolioContentSource | null;
		}
		// interface PageState {}
		interface Platform {
			env: {
				DB?: import('$lib/types/Portfolio').D1DatabaseLike;
				ACCESS_TEAM_DOMAIN?: string;
				ACCESS_AUD?: string;
				ADMIN_EMAIL?: string;
			};
		}
	}
}

export {};
