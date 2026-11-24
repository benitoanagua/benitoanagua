import { expect, test } from '../support/test';

test.describe('FOLIO Pullquote', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders quote text and citation', async ({ page }) => {
		const section = page.getByTestId('folio-pullquote');
		const quote = section.locator('blockquote').first();
		await expect(quote.getByText('A pull quote with attribution.')).toBeVisible();
		await expect(quote.locator('cite')).toHaveText('FOLIO');
	});

	test('renders without citation', async ({ page }) => {
		const quotes = page.getByTestId('folio-pullquote').locator('blockquote');
		await expect(quotes).toHaveCount(2);
		await expect(quotes.nth(1).locator('cite')).toHaveCount(0);
		await expect(quotes.nth(1).getByText('A pull quote without attribution.')).toBeVisible();
	});
});
