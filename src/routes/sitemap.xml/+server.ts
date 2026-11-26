import { SITE_URL } from '$lib/config';
import { getSkillProfileEntries } from '$lib/data/skill-profiles';
import { loadPortfolioContent } from '$lib/server/portfolio-content';
import { loadPublicProjects } from '$lib/server/public-projects';
import type { RequestHandler } from './$types';

export const prerender = false;

const STATIC_ROUTES = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/habilidades', priority: '0.95', changefreq: 'weekly' },
	{ path: '/proyectos', priority: '0.9', changefreq: 'weekly' },
	{ path: '/experiencia', priority: '0.95', changefreq: 'monthly' },
	{ path: '/cv', priority: '0.8', changefreq: 'monthly' }
] as const;

function xmlEscape(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ platform }) => {
	const [portfolio, projectResult] = await Promise.all([
		loadPortfolioContent(platform),
		loadPublicProjects(platform)
	]);

	const routes = new Map(STATIC_ROUTES.map((route) => [route.path, route]));
	for (const project of projectResult.projects.es) {
		routes.set(`/proyectos/${project.slug}`, {
			path: `/proyectos/${project.slug}`,
			priority: '0.7',
			changefreq: 'monthly'
		});
	}
	for (const { slug } of getSkillProfileEntries(portfolio.content)) {
		routes.set(`/habilidades/${slug}`, {
			path: `/habilidades/${slug}`,
			priority: '0.65',
			changefreq: 'monthly'
		});
	}

	const today = new Date().toISOString().slice(0, 10);
	const entries = [...routes.values()]
		.map(
			(route) => `  <url>
    <loc>${xmlEscape(SITE_URL + route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
		}
	});
};
