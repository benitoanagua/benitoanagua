/**
 * Build script to generate dynamic static files
 * Reads SITE_URL from src/lib/config.ts and generates:
 * - static/robots.txt
 * - static/sitemap.xml
 * - static/manifest.json
 */

import fs from 'fs';
import { parse } from 'toml';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const STATIC_DIR = path.join(projectRoot, 'static');
const CONFIG_FILE = path.join(projectRoot, 'src/lib/config.ts');

// Read SITE_URL from config
function readSiteUrl(): string {
	const configContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
	const match = configContent.match(/export const SITE_URL = '([^']+)'/);
	if (!match) {
		throw new Error('Could not find SITE_URL in src/lib/config.ts');
	}
	return match[1];
}

// Generate robots.txt
function generateRobotsTxt(siteUrl: string): string {
	return `# Robots.txt for ${new URL(siteUrl).hostname}
User-agent: *
Allow: /
Allow: /habilidades
Allow: /proyectos
Allow: /experiencia
Allow: /cv

# XML Sitemap
Sitemap: ${siteUrl}/sitemap.xml

`;
}

// Generate sitemap.xml
function generateSitemapXml(siteUrl: string): string {
	const routes = [
		{ path: '/', priority: '1.0', changefreq: 'weekly' },
		{ path: '/habilidades', priority: '0.95', changefreq: 'weekly' },
		{ path: '/proyectos', priority: '0.9', changefreq: 'weekly' },
		{ path: '/experiencia', priority: '0.95', changefreq: 'monthly' },
		{ path: '/cv', priority: '0.8', changefreq: 'monthly' }
	];
	const projectsRaw = fs.readFileSync(
		path.join(projectRoot, 'src/lib/data/projects.es.toml'),
		'utf-8'
	);
	for (const project of (parse(projectsRaw) as { projects: { slug: string }[] }).projects)
		routes.push({ path: `/proyectos/${project.slug}`, priority: '0.7', changefreq: 'monthly' });
	const skillSlug = (value: string) =>
		value
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	for (const language of ['es', 'en']) {
		const cv = parse(
			fs.readFileSync(path.join(projectRoot, `src/lib/data/cv.${language}.toml`), 'utf-8')
		) as { focuses: { skills?: { items?: string[] }[] }[] };
		for (const focus of cv.focuses)
			for (const category of focus.skills ?? [])
				for (const skill of category.items ?? []) {
					const slug = skillSlug(skill);
					if (slug && !routes.some((route) => route.path === `/habilidades/${slug}`))
						routes.push({ path: `/habilidades/${slug}`, priority: '0.65', changefreq: 'monthly' });
				}
	}

	const today = new Date().toISOString().split('T')[0];

	const entries = routes
		.map(
			(route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

// Generate manifest.json
function generateManifestJson(siteUrl: string): string {
	const manifest = {
		name: 'Benito Anagua — Skills & Experience',
		short_name: 'Benito Anagua',
		description:
			'Professional skills connected to work experience across software development, product design, functional analysis, teaching and visual communication.',
		start_url: '/',
		scope: '/',
		display: 'standalone',
		orientation: 'portrait-primary',
		theme_color: '#F5F0E6',
		background_color: '#F5F0E6',
		icons: [
			{
				src: '/favicon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'any maskable'
			}
		],
		categories: ['business', 'education', 'productivity'],
		screenshots: [
			{
				src: '/og-image.png',
				sizes: '1200x630',
				type: 'image/png',
				form_factor: 'wide'
			}
		]
	};

	return JSON.stringify(manifest, null, 2);
}

// Main function
async function main() {
	try {
		const siteUrl = readSiteUrl();
		console.log(`🔧 Generating static files for: ${siteUrl}`);

		// Ensure static directory exists
		if (!fs.existsSync(STATIC_DIR)) {
			fs.mkdirSync(STATIC_DIR, { recursive: true });
		}

		// Generate robots.txt
		const robotsTxt = generateRobotsTxt(siteUrl);
		fs.writeFileSync(path.join(STATIC_DIR, 'robots.txt'), robotsTxt);
		console.log('✓ Generated static/robots.txt');

		// Generate sitemap.xml
		const sitemapXml = generateSitemapXml(siteUrl);
		fs.writeFileSync(path.join(STATIC_DIR, 'sitemap.xml'), sitemapXml);
		console.log('✓ Generated static/sitemap.xml');

		// Generate manifest.json
		const manifestJson = generateManifestJson(siteUrl);
		fs.writeFileSync(path.join(STATIC_DIR, 'manifest.json'), manifestJson);
		console.log('✓ Generated static/manifest.json');

		console.log('\n✅ Static files generated successfully!\n');
	} catch (error) {
		console.error('❌ Error generating static files:', error);
		process.exit(1);
	}
}

main();
