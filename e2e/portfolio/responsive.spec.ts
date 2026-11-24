import { expect, test } from '../support/test';

const VIEWPORTS = [
	{ name: 'mobile narrow', width: 320, height: 700 },
	{ name: 'mobile', width: 390, height: 844 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1280, height: 800 }
];

for (const vp of VIEWPORTS) {
	test(`home has no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
		await page.setViewportSize({ width: vp.width, height: vp.height });
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow, `horizontal overflow at ${vp.width}px`).toBeLessThanOrEqual(1);
	});
}

test('projects grid adapts across viewports', async ({ page }) => {
	for (const vp of VIEWPORTS) {
		await page.setViewportSize({ width: vp.width, height: vp.height });
		await page.goto('/proyectos');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const cards = page.locator('article.project');
		await expect(cards.first()).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow, `horizontal overflow at ${vp.width}px`).toBeLessThanOrEqual(1);
	}
});

test('theme and language controls stay usable on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	const theme = page.getByRole('button', { name: /tema|theme/i });
	const langBtn = page.getByRole('button', { name: /idioma|language/i });
	await expect(theme).toBeVisible();
	await expect(langBtn).toBeVisible();
	const box = await theme.boundingBox();
	expect(box!.width).toBeGreaterThanOrEqual(40);
	expect(box!.height).toBeGreaterThanOrEqual(40);
});
