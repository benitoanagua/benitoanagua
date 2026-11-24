import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '../support/test';

test.describe('Catalog accessibility', () => {
	test('catalog page has no serious or critical axe violations', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const results = await new AxeBuilder({ page }).analyze();
		const serious = results.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);
		expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
	});

	test('dark theme has no serious or critical axe violations', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Switch theme' }).click();
		const results = await new AxeBuilder({ page }).analyze();
		const serious = results.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);
		expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
	});

	test('harness page has no serious or critical axe violations', async ({ page }) => {
		await page.goto('/harness.html');
		const results = await new AxeBuilder({ page }).analyze();
		const serious = results.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);
		expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
	});
	test('keyboard focus is visible and reduced motion is honored', async ({ page }) => {
		await page.goto('/');
		const themeButton = page.getByRole('button', { name: 'Switch theme' });
		await page.keyboard.press('Tab');
		await expect(themeButton).toBeFocused();
		const outline = await themeButton.evaluate((el) => getComputedStyle(el).outlineStyle);
		expect(outline).toBe('solid');

		await page.emulateMedia({ reducedMotion: 'reduce' });
		const loading = page.getByRole('button', { name: 'Procesando' });
		const animation = await loading
			.locator('.spinner')
			.evaluate((el) => getComputedStyle(el).animationName);
		expect(animation).toBe('none');
	});
});
