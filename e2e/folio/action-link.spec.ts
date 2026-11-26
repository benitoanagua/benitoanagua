import { expect, test } from '../support/test';

test.describe('FOLIO ActionLink', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders its title, description and action label as a link', async ({ page }) => {
		const section = page.getByTestId('folio-action-link');
		const link = section.getByRole('link', { name: /Explore FOLIO Reusable action link with supporting context\. View details/ });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('href', '#folio-action-link');
		await expect(link.getByText('Explore FOLIO', { exact: true })).toBeVisible();
		await expect(link.getByText('Reusable action link with supporting context.', { exact: true })).toBeVisible();
	});

	test('provides a visible keyboard focus indicator', async ({ page }) => {
		const link = page.getByTestId('folio-action-link').getByRole('link');
		await link.focus();
		await expect(link).toBeFocused();
		await expect(link).toHaveCSS('outline-style', 'solid');
	});
});
