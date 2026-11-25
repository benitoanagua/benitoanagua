import { expect, test } from '../support/test';

test.describe('FOLIO ProjectCard', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders title, description, metadata and tags', async ({ page }) => {
		const card = page.getByTestId('folio-project-card').getByRole('article');
		await expect(card.getByRole('heading', { name: /Harness project/ })).toBeVisible();
		await expect(card.getByText('Project card fixture for E2E coverage.')).toBeVisible();
		await expect(card.getByText('Category')).toBeVisible();
		await expect(card.getByText('2026')).toBeVisible();
		const tags = card.locator('.tags');
		await expect(tags).toContainText('Svelte');
		// The tags group keeps a text label for assistive technology without
		// painting it on screen (aria-label on a paragraph is not reliable).
		await expect(tags).toContainText('Technologies');
		// Playwright treats a clipped 1px node as visible, so assert its box.
		const hiddenBox = await tags.locator('.ds-visually-hidden').boundingBox();
		expect(hiddenBox?.width ?? Infinity).toBeLessThanOrEqual(1);
		expect(hiddenBox?.height ?? Infinity).toBeLessThanOrEqual(1);
	});

	test('title link navigates to the project href', async ({ page }) => {
		const card = page.getByTestId('folio-project-card').getByRole('article');
		await expect(card.getByRole('link', { name: /Harness project/ })).toHaveAttribute(
			'href',
			'#folio-project-card'
		);
	});

	test('external source link uses safe attributes', async ({ page }) => {
		const card = page.getByTestId('folio-project-card').getByRole('article');
		const source = card.getByRole('link', { name: /Source/ });
		await expect(source).toHaveAttribute('href', 'https://example.com/source');
		await expect(source).toHaveAttribute('target', '_blank');
		await expect(source).toHaveAttribute('rel', /noreferrer/);
	});
});
