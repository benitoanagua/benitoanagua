import { expect, test } from '../support/test';

test.describe('FOLIO Badge', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders all tones with visible text', async ({ page }) => {
		const section = page.getByTestId('folio-badge');
		for (const tone of ['Neutral', 'Success', 'Warning', 'Danger']) {
			await expect(section.getByText(tone, { exact: true })).toBeVisible();
		}
	});

	test('tone is not communicated by color alone', async ({ page }) => {
		const badge = page.getByTestId('folio-badge').getByText('Success', { exact: true });
		// Each badge exposes a textual label; the ::before marker is decorative.
		await expect(badge).toHaveText('Success');
	});
});
