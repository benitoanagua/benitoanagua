import { expect, test } from '../support/test';

test.describe('FOLIO Notice', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('renders all tones with their labels', async ({ page }) => {
		const section = page.getByTestId('folio-notice');
		for (const label of ['Note', 'Success', 'Warning', 'Error']) {
			await expect(section.getByText(label, { exact: true })).toBeVisible();
		}
		for (const body of [
			'Note tone body.',
			'Success tone body.',
			'Warning tone body.',
			'Error tone body.'
		]) {
			await expect(section.getByText(body)).toBeVisible();
		}
	});

	test('tone is exposed via text label, not color alone', async ({ page }) => {
		const section = page.getByTestId('folio-notice');
		// Each notice renders a textual tone label next to the body.
		await expect(section.getByText('Warning', { exact: true })).toBeVisible();
	});

	test('error tone uses alert role, others use status', async ({ page }) => {
		const section = page.getByTestId('folio-notice');
		await expect(section.getByRole('alert')).toHaveCount(1);
		await expect(section.getByRole('status')).toHaveCount(3);
	});
});
