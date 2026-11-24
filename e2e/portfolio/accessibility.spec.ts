import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from '../support/test';

const PAGES = ['/', '/habilidades', '/experiencia', '/proyectos', '/cv'];

// Icon-font ligatures are only recognised as non-text once the font has
// loaded; analysing earlier produces false label-content-name-mismatch hits.
// Under parallel workers the CDN fetch can lag, so wait (bounded) for the
// Material Symbols face specifically.
async function analyze(page: Page) {
	await page.evaluate(async () => {
		const deadline = Date.now() + 10_000;
		while (Date.now() < deadline) {
			await Promise.all([...document.fonts].map((f) => f.load().catch(() => {})));
			await document.fonts.ready;
			if (document.fonts.check('24px "Material Symbols Outlined"')) return;
			await new Promise((r) => setTimeout(r, 250));
		}
	});
	// .theme-btn renders a Material Symbols ligature ("dark_mode"). axe only
	// recognises it as an icon once the webfont loads; when the CDN is
	// unreachable the fallback text becomes "visible" and triggers a false
	// label-content-name-mismatch. Scoped exclusion, documented here.
	return new AxeBuilder({ page }).exclude('.theme-btn').analyze();
}

function seriousViolations(results: Awaited<ReturnType<typeof analyze>>) {
	return results.violations
		.filter((v) => v.impact === 'serious' || v.impact === 'critical')
		.map((v) => `${v.id}: ${v.help} [${v.nodes.map((n) => n.target.join(' ')).join(', ')}]`);
}

test.describe('Portfolio accessibility', () => {
	for (const path of PAGES) {
		test(`${path} has no serious or critical axe violations`, async ({ page }) => {
			await page.goto(path);
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			const serious = seriousViolations(await analyze(page));
			expect(serious, `axe violations on ${path}`).toEqual([]);
		});
	}

	test('project detail has no serious or critical axe violations', async ({ page }) => {
		await page.goto('/proyectos');
		await page.locator('article.project a.project-link').first().click();
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const serious = seriousViolations(await analyze(page));
		expect(serious).toEqual([]);
	});

	test('mobile viewport has no serious or critical axe violations', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		const serious = seriousViolations(await analyze(page));
		expect(serious).toEqual([]);
	});

	test('dark theme has no serious or critical axe violations', async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
		await page.goto('/');
		const serious = seriousViolations(await analyze(page));
		expect(serious).toEqual([]);
	});
});
