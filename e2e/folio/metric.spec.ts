import { expect, test } from '../support/test';

test.describe('FOLIO Metric', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders value, label and note', async ({ page }) => {
		const section = page.getByTestId('folio-metric');
		await expect(section.getByText('42')).toBeVisible();
		await expect(section.getByText('Numeric value', { exact: true })).toBeVisible();
		await expect(section.getByText('With a note.')).toBeVisible();
	});

	test('renders non-numeric values', async ({ page }) => {
		const section = page.getByTestId('folio-metric');
		await expect(section.getByText('—')).toBeVisible();
		await expect(section.getByText('Non-numeric value', { exact: true })).toBeVisible();
	});
});
