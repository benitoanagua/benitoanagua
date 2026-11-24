import { expect, test } from '../support/test';

test.describe('Portfolio theme', () => {
	test('applies a data-theme on load', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('data-theme', /light|dark/);
	});

	test('theme toggle switches data-theme and persists', async ({ page }) => {
		await page.goto('/');
		const toggle = page.getByRole('button', { name: /tema|theme/i });
		const initial = await page.locator('html').getAttribute('data-theme');
		const expected = initial === 'dark' ? 'light' : 'dark';

		// Retry until the hydrated click handler applies the change.
		await expect(async () => {
			await toggle.click();
			await expect(page.locator('html')).toHaveAttribute('data-theme', expected, {
				timeout: 2000
			});
		}).toPass();

		await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe(expected);
		// Persisted across reload.
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
	});

	test('saved theme wins over system preference', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.setItem('theme', 'light'));
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	});
});
