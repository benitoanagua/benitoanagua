/**
 * Build script to generate dynamic static files
 * Reads SITE_URL from src/lib/config.ts and generates:
 * - static/robots.txt
 * - static/manifest.json
 */

import fs from 'fs';
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

// Generate manifest.json
function generateManifestJson(): string {
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

		// The sitemap is served dynamically by the SvelteKit route using D1.
		// Remove stale generated output so it cannot shadow the runtime endpoint.
		fs.rmSync(path.join(STATIC_DIR, 'sitemap.xml'), { force: true });
		console.log('✓ Sitemap delegated to runtime D1 endpoint');

		// Generate manifest.json
		const manifestJson = generateManifestJson();
		fs.writeFileSync(path.join(STATIC_DIR, 'manifest.json'), manifestJson);
		console.log('✓ Generated static/manifest.json');

		console.log('\n✅ Static files generated successfully!\n');
	} catch (error) {
		console.error('❌ Error generating static files:', error);
		process.exit(1);
	}
}

main();
