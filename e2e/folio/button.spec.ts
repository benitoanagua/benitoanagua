import { expect, test } from '../support/test';

test.describe('FOLIO Button', () => {
	let section: ReturnType<import('@playwright/test').Page['getByTestId']>;

	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
		section = page.getByTestId('folio-button');
	});

	test('renders all public variants', async () => {
		await expect(section.getByRole('button', { name: 'Primary click' })).toBeVisible();
		await expect(section.getByRole('button', { name: 'Secondary small' })).toBeVisible();
		await expect(section.getByRole('button', { name: 'Outline large' })).toBeVisible();
		await expect(section.getByRole('button', { name: 'Ghost' })).toBeVisible();
	});

	test('activates on click', async ({ page }) => {
		await section.getByRole('button', { name: 'Primary click' }).click();
		await expect(page.getByTestId('folio-button-count')).toHaveText('1');
	});

	test('activates via keyboard', async ({ page }) => {
		const button = section.getByRole('button', { name: 'Primary click' });
		await button.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('folio-button-count')).toHaveText('1');
	});

	test('disabled button does not fire its action', async ({ page }) => {
		const button = section.getByRole('button', { name: 'Disabled', exact: true });
		await expect(button).toBeDisabled();
		await button.click({ force: true });
		await expect(page.getByTestId('folio-button-disabled-count')).toHaveText('0');
	});

	test('loading button is disabled and busy', async () => {
		const button = section.getByRole('button', { name: 'Loading' });
		await expect(button).toBeDisabled();
		await expect(button).toHaveAttribute('aria-busy', 'true');
	});
});
