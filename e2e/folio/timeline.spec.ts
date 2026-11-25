import { expect, test } from '../support/test';

test.describe('FOLIO Timeline', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders entries in order with period, title and organization', async ({ page }) => {
		const list = page.getByTestId('folio-timeline').locator('.ds-timeline').first();
		// Explicit list role keeps the semantics Safari drops for list-style: none.
		await expect(list).toHaveAttribute('role', 'list');
		const items = list.locator('li');
		await expect(items).toHaveCount(2);
		await expect(items.nth(0)).toContainText('2020');
		await expect(items.nth(0)).toContainText('First role');
		await expect(items.nth(0)).toContainText('Org A');
		await expect(items.nth(1)).toContainText('2024');
		await expect(items.nth(1)).toContainText('Second role');
	});

	test('renders descriptions', async ({ page }) => {
		const list = page.getByTestId('folio-timeline').locator('.ds-timeline').first();
		await expect(list.getByText('First entry')).toBeVisible();
		await expect(list.getByText('Second entry')).toBeVisible();
	});

	test('empty items render an empty list without errors', async ({ page }) => {
		const lists = page.getByTestId('folio-timeline').locator('.ds-timeline');
		await expect(lists).toHaveCount(2);
		await expect(lists.nth(1).locator('li')).toHaveCount(0);
	});
});
