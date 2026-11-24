import { expect, test } from '../support/test';

test.describe('FOLIO SocialLinks', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders links with accessible names', async ({ page }) => {
		const nav = page.getByRole('navigation', { name: 'Harness profile links' });
		await expect(nav.getByRole('link', { name: /GitHub/ })).toBeVisible();
		await expect(nav.getByRole('link', { name: /LinkedIn/ })).toBeVisible();
	});

	test('external links use safe attributes', async ({ page }) => {
		const link = page.getByRole('navigation', { name: 'Harness profile links' }).getByRole('link', {
			name: /GitHub/
		});
		await expect(link).toHaveAttribute('href', 'https://github.com/example');
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', /noreferrer/);
	});

	test('empty items render an empty navigation', async ({ page }) => {
		// An empty nav collapses to zero size; assert it exists in the DOM with no links.
		const nav = page.getByRole('navigation', { name: 'Empty links' });
		await expect(nav).toHaveCount(1);
		await expect(nav.getByRole('link')).toHaveCount(0);
	});
});
