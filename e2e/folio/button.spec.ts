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

	const boxMetrics = (el: Element) => {
		const s = getComputedStyle(el);
		return {
			paddingLeft: parseFloat(s.paddingLeft),
			paddingRight: parseFloat(s.paddingRight),
			scrollWidth: el.scrollWidth,
			clientWidth: el.clientWidth
		};
	};

	test('keeps explicit symmetric horizontal padding on every variant', async () => {
		// md buttons (primary, ghost, disabled, loading) share the same padding
		const mdButtons = [
			section.getByRole('button', { name: 'Primary click' }),
			section.getByRole('button', { name: 'Ghost' }),
			section.getByRole('button', { name: 'Disabled', exact: true }),
			section.getByRole('button', { name: 'Loading' })
		];
		for (const button of mdButtons) {
			const m = await button.evaluate(boxMetrics);
			expect(m.paddingLeft, 'horizontal padding must not collapse to 0').toBeGreaterThanOrEqual(16);
			expect(m.paddingLeft).toBe(m.paddingRight);
		}
		// size variants scale padding coherently instead of sharing one value
		const sm = await section.getByRole('button', { name: 'Secondary small' }).evaluate(boxMetrics);
		const lg = await section.getByRole('button', { name: 'Outline large' }).evaluate(boxMetrics);
		const md = await section.getByRole('button', { name: 'Ghost' }).evaluate(boxMetrics);
		expect(sm.paddingLeft).toBeGreaterThan(0);
		expect(sm.paddingLeft).toBeLessThan(md.paddingLeft);
		expect(lg.paddingLeft).toBeGreaterThan(md.paddingLeft);
	});

	test('outline variant has a visible border', async () => {
		const outline = section.getByRole('button', { name: 'Outline large' });
		const border = await outline.evaluate((el) => {
			const style = getComputedStyle(el);
			return { width: style.borderTopWidth, style: style.borderTopStyle };
		});
		expect(parseFloat(border.width)).toBeGreaterThanOrEqual(1);
		expect(border.style).toBe('solid');
	});

	test('button label never overflows its box', async () => {
		for (const button of await section.getByRole('button').all()) {
			const m = await button.evaluate(boxMetrics);
			expect(
				m.scrollWidth,
				`label overflows in "${await button.textContent()}"`
			).toBeLessThanOrEqual(m.clientWidth + 1);
		}
	});

	test('keeps padding and focus ring across interactive states', async ({ page }) => {
		const button = section.getByRole('button', { name: 'Primary click' });
		const before = await button.evaluate(boxMetrics);
		await button.hover();
		const hover = await button.evaluate(boxMetrics);
		expect(hover.paddingLeft).toBe(before.paddingLeft);
		// Reach the button with the keyboard so :focus-visible applies
		for (let i = 0; i < 20; i++) {
			await page.keyboard.press('Tab');
			if (await button.evaluate((el) => el === document.activeElement)) break;
		}
		expect(await button.evaluate((el) => el === document.activeElement)).toBe(true);
		expect(await button.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
		const outline = await button.evaluate((el) => getComputedStyle(el).outlineStyle);
		expect(outline).not.toBe('none');
	});
});
