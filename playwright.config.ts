import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const PORTFOLIO_URL = 'http://localhost:5173';
const CATALOG_URL = 'http://localhost:5174';

// Prefer the OS-provided Chromium when available; otherwise Playwright uses
// its own downloaded build (`pnpm e2e:install`).
const SYSTEM_CHROMIUM = ['/usr/bin/chromium', '/usr/bin/chromium-browser'].find((p) =>
	existsSync(p)
);
const chromiumLaunch = SYSTEM_CHROMIUM
	? { executablePath: SYSTEM_CHROMIUM, args: ['--no-sandbox'] }
	: {};

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		// Deterministic locale: the portfolio detects navigator.language and
		// defaults Spanish-labeled specs to 'es'.
		locale: 'es-ES',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},
	projects: [
		{
			name: 'portfolio',
			testDir: './e2e/portfolio',
			use: {
				...devices['Desktop Chrome'],
				baseURL: PORTFOLIO_URL,
				launchOptions: chromiumLaunch
			}
		},
		{
			name: 'portfolio-mobile',
			testDir: './e2e/portfolio',
			testMatch: /(responsive|navigation)\.spec\.ts/,
			use: {
				...devices['Pixel 7'],
				baseURL: PORTFOLIO_URL,
				launchOptions: chromiumLaunch
			}
		},
		{
			name: 'catalog',
			testDir: './e2e/catalog',
			use: {
				...devices['Desktop Chrome'],
				baseURL: CATALOG_URL,
				launchOptions: chromiumLaunch
			}
		},
		{
			name: 'folio',
			testDir: './e2e/folio',
			use: {
				...devices['Desktop Chrome'],
				baseURL: CATALOG_URL,
				launchOptions: chromiumLaunch
			}
		}
	],
	webServer: [
		{
			// Serve the production build through the same Pages emulation used by
			// `pnpm preview`; avoids vite-dev transform races under parallel workers.
			command:
				'pnpm d1:migrations:local && pnpm build && pnpm dlx wrangler@4 pages dev .svelte-kit/cloudflare --port 5173 --ip 127.0.0.1',
			url: PORTFOLIO_URL,
			reuseExistingServer: !process.env.CI,
			timeout: 300_000
		},
		{
			command:
				'pnpm catalog:build && pnpm exec vite preview --config apps/catalog/vite.config.ts --port 5174 --strictPort',
			url: CATALOG_URL,
			reuseExistingServer: !process.env.CI,
			timeout: 300_000
		}
	]
});
