import { expect, test } from '../support/test';

test.describe('FOLIO Flex', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/harness.html');
	});

	test('applies direction, gap and padding tokens', async ({ page }) => {
		const row = page.getByTestId('folio-flex-row');
		const style = await row.evaluate((el) => {
			const computed = getComputedStyle(el);
			return {
				direction: computed.flexDirection,
				gap: parseFloat(computed.columnGap),
				paddingBlock: parseFloat(computed.paddingBlockStart),
				paddingInline: parseFloat(computed.paddingInlineStart)
			};
		});
		expect(style.direction).toBe('row');
		expect(style.gap).toBeGreaterThan(0);
		expect(style.paddingBlock).toBeGreaterThan(0);
		expect(style.paddingInline).toBeGreaterThan(style.paddingBlock);
	});

	test('supports wrapping and renders its children', async ({ page }) => {
		const wrap = page.getByTestId('folio-flex-wrap');
		await expect(wrap).toHaveCSS('flex-wrap', 'wrap');
		await expect(wrap.getByText('Item 6')).toBeVisible();
	});
});
