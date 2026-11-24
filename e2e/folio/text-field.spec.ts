import { expect, test } from '../support/test';

test.describe('FOLIO TextField', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('associates label, hint and input', async ({ page }) => {
		const input = page.getByLabel('Email address');
		await expect(input).toBeVisible();
		await expect(input).toHaveAttribute('placeholder', 'name@example.com');
		await expect(page.getByText('We only use this locally.')).toBeVisible();
		await expect(input).toHaveAttribute('aria-describedby', 'harness-email-hint');
	});

	test('accepts input and exposes the value', async ({ page }) => {
		const input = page.getByLabel('Email address');
		await input.fill('dev@example.com');
		await expect(input).toHaveValue('dev@example.com');
	});

	test('error state is announced and described', async ({ page }) => {
		const input = page.getByLabel('Invalid field');
		await expect(input).toHaveAttribute('aria-invalid', 'true');
		await expect(input).toHaveAttribute('aria-describedby', 'harness-invalid-error');
		await expect(page.getByText('This field has an error.')).toBeVisible();
	});

	test('is reachable and usable by keyboard', async ({ page }) => {
		const input = page.getByLabel('Email address');
		await input.focus();
		await page.keyboard.type('a@b.co');
		await expect(input).toHaveValue('a@b.co');
	});
});
