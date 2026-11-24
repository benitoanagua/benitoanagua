import { expect, test } from '../support/test';

test.describe('FOLIO Divider', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders separators with accessible semantics', async ({ page }) => {
		const section = page.getByTestId('folio-divider');
		// hair, soft, thick, double, labeled and vertical variants expose role="separator"
		await expect(section.getByRole('separator')).toHaveCount(6);
	});

	test('labeled divider exposes its label', async ({ page }) => {
		const section = page.getByTestId('folio-divider');
		await expect(section.getByText('Labeled divider')).toBeVisible();
	});

	test('vertical divider is marked vertical', async ({ page }) => {
		const section = page.getByTestId('folio-divider');
		await expect(section.locator('[aria-orientation="vertical"]')).toHaveCount(1);
	});

	test('space variant renders no visible rule', async ({ page }) => {
		const section = page.getByTestId('folio-divider');
		const space = section.locator('.ds-divider.space');
		await expect(space).toHaveCount(1);
		await expect(space).toHaveAttribute('aria-hidden', 'true');
		// A spacing-only divider must not paint a border.
		const borderTopWidth = await space.evaluate((el) => getComputedStyle(el).borderTopWidth);
		expect(borderTopWidth).toBe('0px');
	});
});
