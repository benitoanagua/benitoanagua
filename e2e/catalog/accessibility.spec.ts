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
});
