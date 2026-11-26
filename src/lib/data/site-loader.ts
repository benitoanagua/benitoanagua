import type { SiteData } from '$lib/types/Site';
import type { PortfolioContent } from '$lib/types/Portfolio';
import { lang } from '$lib/state/lang.svelte';

export function loadSiteData(content: PortfolioContent): SiteData {
	return content.site[lang.current];
}
