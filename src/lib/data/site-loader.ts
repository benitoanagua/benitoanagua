import { parse } from 'toml';
import type { SiteData } from '$lib/types/Site';
import type { PortfolioContent } from '$lib/types/Portfolio';
import { lang } from '$lib/state/lang.svelte';
import siteEs from './site.es.toml?raw';
import siteEn from './site.en.toml?raw';

export function loadSiteData(content?: PortfolioContent | null): SiteData {
	const localized = content?.site[lang.current];
	if (localized) return localized;
	const raw = lang.current === 'en' ? siteEn : siteEs;
	return parse(raw) as SiteData;
}
