import { expect, test } from '../support/test';

test.describe('Portfolio language', () => {
	test('language toggle updates content and html lang', async ({ page }) => {
		await page.goto('/');
		const toggle = page.getByRole('button', { name: /idioma|language/i });
		await expect(toggle).toBeVisible();
		const initialLang = await page.locator('html').getAttribute('lang');
		expect(['es', 'en']).toContain(initialLang);
		const expected = initialLang === 'es' ? 'en' : 'es';

		// The hero name is the same in both languages; the lead is localized.
		const leadBefore = await page.locator('.hero-lead').textContent();

		// The button is server-rendered before hydration; retry the click until
		// the hydrated handler applies the change.
		await expect(async () => {
			await toggle.click();
			await expect(page.locator('html')).toHaveAttribute('lang', expected, { timeout: 2000 });
		}).toPass();

		await expect.poll(() => page.evaluate(() => localStorage.getItem('lang'))).toBe(expected);

		// Navigation labels switch language too.
		const nav = page.getByRole('navigation').first();
		await expect(
			nav.getByRole('link', { name: expected === 'en' ? 'Skills' : 'Habilidades', exact: true })
		).toBeVisible();
		const leadAfter = await page.locator('.hero-lead').textContent();
		expect(leadAfter).not.toBe(leadBefore);
	});

	test('language persists across reload and navigation', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.setItem('lang', 'en'));
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
		await page.goto('/experiencia');
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
		await expect(
			page.getByRole('navigation').first().getByRole('link', { name: 'Experience', exact: true })
		).toBeVisible();
	});
});
