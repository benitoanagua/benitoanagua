import { expect, test } from '../support/test';

test.describe('FOLIO SectionHeading', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders eyebrow, title and description', async ({ page }) => {
		const section = page.getByTestId('folio-section-heading');
		await expect(section.getByText('EYEBROW').first()).toBeVisible();
		await expect(section.getByRole('heading', { name: 'Level two title', level: 2 })).toBeVisible();
		await expect(section.getByText('Optional description.')).toBeVisible();
	});

	test('supports level 3 and centered alignment', async ({ page }) => {
		const section = page.getByTestId('folio-section-heading');
		await expect(
			section.getByRole('heading', { name: 'Level three title', level: 3 })
		).toBeVisible();
	});
});
