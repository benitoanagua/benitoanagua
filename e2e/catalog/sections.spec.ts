import { expect, test } from '../support/test';

test.describe('Catalog sections and components', () => {
	test('all five sections render their component examples', async ({ page }) => {
		await page.goto('/');
		const expected: Record<string, RegExp[]> = {
			foundations: [/Palette/, /Type/, /Reading first\./],
			actions: [/Primary/, /Secondary/, /Outline/, /Ghost/, /Success/, /Warning/, /Danger/],
			content: [/Example project/, /Role or milestone/, /GitHub/, /Verified metric/],
			forms: [/Email address/, /Note/, /Warning/],
			editorial: [
				/SectionHeading|Pullquote|Marginalia|Clarity is a feature/,
				/Keep the primary reading column/
			],
			contracts: [/The actual exported API/, /Badge/, /TextField/, /13 components/],
			'reading-checks': [
				/Spanish, long content and states/,
				/Atención/,
				/Correo electrónico/,
				/Deshabilitado/,
				/Procesando/
			]
		};
		for (const [id, texts] of Object.entries(expected)) {
			const section = page.locator(`#${id}`);
			await expect(section).toBeVisible();
			for (const text of texts) {
				await expect(section.getByText(text).first()).toBeVisible();
			}
		}
	});

	test('buttons are real buttons and clickable', async ({ page }) => {
		await page.goto('/');
		const actions = page.locator('#actions');
		await expect(actions.getByRole('button', { name: 'Primary' })).toBeVisible();
		await expect(actions.getByRole('button', { name: 'Secondary' })).toBeVisible();
	});

	test('project card example links safely', async ({ page }) => {
		await page.goto('/');
		const card = page.locator('#content article').first();
		const link = card.getByRole('link', { name: /Example project/ });
		await expect(link).toHaveAttribute('href', '#examples');
	});

	test('external links use safe attributes', async ({ page }) => {
		await page.goto('/');
		const footer = page.locator('footer');
		const repo = footer.getByRole('link', { name: /Source repository/ });
		await expect(repo).toHaveAttribute('href', 'https://github.com/benitoanagua/benitoanagua');
		await expect(repo).toHaveAttribute('target', '_blank');
	});

	test('catalog works on mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(1);
		for (const id of [
			'foundations',
			'actions',
			'content',
			'forms',
			'editorial',
			'contracts',
			'reading-checks'
		]) {
			await expect(page.locator(`#${id}`)).toBeVisible();
		}
	});
	test('catalog reflows without horizontal overflow at narrow width', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(1);
		await expect(page.locator('#reading-checks')).toBeVisible();
		await expect(page.locator('#contracts .contract').last()).toBeVisible();
	});

	test('component API navigation and state examples are exposed', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Component API' }).click();
		await expect(page).toHaveURL(/#contracts$/);
		await expect(page.locator('#contracts .contract')).toHaveCount(13);
		await expect(page.locator('#reading-checks')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Deshabilitado' })).toBeDisabled();
		const loading = page.getByRole('button', { name: 'Procesando' });
		await expect(loading).toBeDisabled();
		await expect(loading).toHaveAttribute('aria-busy', 'true');
	});

	test('catalog navigation is keyboard reachable', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		await expect(page.getByRole('button', { name: 'Switch theme' })).toBeFocused();
		const focusStyle = await page.getByRole('button', { name: 'Switch theme' }).evaluate((el) => {
			const style = getComputedStyle(el);
			return style.outlineStyle !== 'none' || style.boxShadow !== 'none';
		});
		expect(focusStyle).toBeTruthy();
	});
});
