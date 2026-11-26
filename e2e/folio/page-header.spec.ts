import { expect, test } from '../support/test';

test.describe('FOLIO PageHeader', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders default h1 with eyebrow and description', async ({ page }) => {
		const section = page.getByTestId('folio-page-header');
		await expect(
			section.getByRole('heading', { name: 'Harness page title', level: 1 })
		).toBeVisible();
		await expect(section.getByText('ADMIN / WORKSPACE', { exact: true })).toBeVisible();
		await expect(section.getByText('A concise page description.', { exact: true })).toBeVisible();
	});

	test('supports an explicit lower heading level', async ({ page }) => {
		const section = page.getByTestId('folio-page-header');
		await expect(section.getByRole('heading', { name: 'Level two title', level: 2 })).toBeVisible();
		await expect(section.getByRole('heading', { level: 1 })).toHaveCount(1);
	});
});
