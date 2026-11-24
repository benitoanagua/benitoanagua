import { expect, test } from '../support/test';

test.describe('Catalog theme', () => {
	test('switch theme button toggles data-theme', async ({ page }) => {
		await page.goto('/');
		const button = page.getByRole('button', { name: 'Switch theme' });
		await expect(button).toBeVisible();
		const initial = await page.locator('html').getAttribute('data-theme');
		await button.click();
		const next = await page.locator('html').getAttribute('data-theme');
		expect(['light', 'dark']).toContain(next);
		expect(next).not.toBe(initial);
	});

	test('components remain visible after theme switch', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Switch theme' }).click();
		for (const id of ['foundations', 'actions', 'content', 'forms', 'editorial']) {
			await expect(page.locator(`#${id}`)).toBeVisible();
		}
	});
});
