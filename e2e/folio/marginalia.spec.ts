import { expect, test } from '../support/test';

test.describe('FOLIO Marginalia', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders main content and aside', async ({ page }) => {
		const section = page.getByTestId('folio-marginalia');
		await expect(section.getByText('Main column content.')).toBeVisible();
		await expect(section.getByTestId('folio-marginalia-aside')).toBeVisible();
		await expect(section.getByText('Aside label')).toBeVisible();
	});

	test('aside stays visible on narrow viewports', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 700 });
		const section = page.getByTestId('folio-marginalia');
		await expect(section.getByTestId('folio-marginalia-aside')).toBeVisible();
		await expect(section.getByText('Main column content.')).toBeVisible();
	});
});
