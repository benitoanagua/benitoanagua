import { expect, test } from '../support/test';

test.describe('Catalog navigation', () => {
	test('loads with title, heading and description', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/FOLIO/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const descriptions = page.locator('meta[name="description"]');
		await expect(descriptions).toHaveCount(1);
		await expect(descriptions).toHaveAttribute('content', /component catalog/i);
	});

	test('section nav links point to existing sections', async ({ page }) => {
		await page.goto('/');
		const nav = page.getByRole('navigation', { name: 'Catalog sections' });
		for (const section of ['foundations', 'actions', 'content', 'forms', 'editorial']) {
			const link = nav.getByRole('link', { name: new RegExp(section, 'i') });
			await expect(link).toHaveAttribute('href', `#${section}`);
			await expect(page.locator(`#${section}`)).toHaveCount(1);
		}
	});

	test('clicking a nav link scrolls to the section', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('navigation', { name: 'Catalog sections' })
			.getByRole('link', { name: /forms/i })
			.click();
		await expect(page).toHaveURL(/#forms$/);
		const forms = page.locator('#forms');
		await expect(forms).toBeInViewport();
	});

	test('has no duplicate section anchors', async ({ page }) => {
		await page.goto('/');
		for (const id of ['foundations', 'actions', 'content', 'forms', 'editorial']) {
			await expect(page.locator(`#${id}`)).toHaveCount(1);
		}
	});
});
