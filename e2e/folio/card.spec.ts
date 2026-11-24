import { expect, test } from '../support/test';

test.describe('FOLIO Card', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders title and slot content', async ({ page }) => {
		const section = page.getByTestId('folio-card');
		await expect(section.getByText('Titled card', { exact: true })).toBeVisible();
		await expect(section.getByText('Card body content.')).toBeVisible();
	});

	test('renders without a title', async ({ page }) => {
		const section = page.getByTestId('folio-card');
		await expect(section.getByText('Untitled card content.')).toBeVisible();
	});
});
