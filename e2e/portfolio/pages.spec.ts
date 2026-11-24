import { expect, test } from '../support/test';

const PAGES = [
	{ path: '/', name: /./ },
	{ path: '/habilidades', name: /habilidades|skills/i },
	{ path: '/experiencia', name: /experiencia|experience/i },
	{ path: '/proyectos', name: /proyectos|projects/i },
	{ path: '/cv', name: /cv/i }
];

test.describe('Portfolio pages', () => {
	for (const { path } of PAGES) {
		test(`${path} has a visible h1 and non-empty main`, async ({ page }) => {
			await page.goto(path);
			const h1 = page.getByRole('heading', { level: 1 });
			await expect(h1).toBeVisible();
			await expect(h1).not.toBeEmpty();
			const main = page.locator('#main');
			await expect(main).toBeVisible();
			await expect(main).not.toBeEmpty();
		});
	}

	test('skill detail page renders from a real skill link', async ({ page }) => {
		await page.goto('/habilidades');
		const skillLink = page.locator('a[href^="/habilidades/"], a[href^="./habilidades/"]').first();
		await expect(skillLink).toBeVisible();
		const href = await skillLink.getAttribute('href');
		expect(href).toMatch(/^\.?\/habilidades\/.+/);
		await skillLink.click();
		const expectedPath = new URL(href!, 'http://localhost').pathname;
		await expect(page).toHaveURL(new RegExp(`${expectedPath}$`));
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('every main page sets a document title', async ({ page }) => {
		for (const { path } of PAGES) {
			await page.goto(path);
			await expect(page).toHaveTitle(/.+/);
		}
	});
});
