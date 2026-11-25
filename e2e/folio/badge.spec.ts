import { expect, test } from '../support/test';

test.describe('FOLIO Badge', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders all tones with visible text', async ({ page }) => {
		const section = page.getByTestId('folio-badge');
		const badges = section.locator('.ds-badge');
		await expect(badges).toHaveCount(4);
		for (const tone of ['Neutral', 'Success', 'Warning', 'Danger']) {
			await expect(badges.filter({ hasText: tone })).toBeVisible();
		}
	});

	test('tone is not communicated by color alone', async ({ page }) => {
		const badge = page
			.getByTestId('folio-badge')
			.locator('.ds-badge')
			.filter({ hasText: 'Success' });
		// Each badge exposes a textual label; the leading marker is decorative.
		await expect(badge).toContainText('Success');
		await expect(badge.locator('.ds-badge-dot')).toHaveAttribute('aria-hidden', 'true');
		// The assistive-technology tree reads the label without the marker.
		const snapshot = await badge.ariaSnapshot();
		expect(snapshot).toContain('Success');
		expect(snapshot).not.toContain('·');
	});
});
