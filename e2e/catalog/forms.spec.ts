import { expect, test } from '../support/test';

test.describe('Catalog forms', () => {
	test('TextField has an associated label and accepts input', async ({ page }) => {
		await page.goto('/');
		const input = page.getByLabel('Email address');
		await expect(input).toBeVisible();
		await input.fill('visitor@example.com');
		await expect(input).toHaveValue('visitor@example.com');
		// The catalog reflects the bound value locally; nothing is submitted.
		await expect(page.getByText('Value: entered')).toBeVisible();
	});

	test('form example does not navigate or submit anywhere', async ({ page }) => {
		await page.goto('/');
		const url = page.url();
		const input = page.getByLabel('Email address');
		await input.press('Enter');
		expect(page.url()).toBe(url);
	});
});
