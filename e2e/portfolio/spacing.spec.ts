import { expect, test } from '../support/test';

/**
 * Regression coverage for the editorial spacing defects:
 * concatenated nav links, collapsed button/card padding and clipped icons.
 */

const REQUIRED_VIEWPORTS = [
	{ width: 320, height: 740 },
	{ width: 375, height: 812 },
	{ width: 768, height: 1024 },
	{ width: 1024, height: 768 },
	{ width: 1440, height: 900 }
];

async function navLinkBoxes(nav: import('@playwright/test').Locator) {
	return nav.locator('a').evaluateAll((els) =>
		els.map((el) => {
			const r = el.getBoundingClientRect();
			return { left: r.left, right: r.right, label: el.textContent?.trim() ?? '' };
		})
	);
}

test.describe('Portfolio spacing and markers', () => {
	test('visible navigation keeps real separation between links', async ({ page }) => {
		for (const vp of [REQUIRED_VIEWPORTS[1], REQUIRED_VIEWPORTS[4]]) {
			await page.setViewportSize(vp);
			await page.goto('/');
			// Exactly one of toolbar-nav / mobile-nav is displayed per breakpoint
			const nav = page.locator('nav:visible').first();
			await expect(nav).toBeVisible();
			const boxes = await navLinkBoxes(nav);
			expect(boxes.length, `nav links at ${vp.width}px`).toBeGreaterThanOrEqual(4);
			for (let i = 1; i < boxes.length; i++) {
				const gap = boxes[i].left - boxes[i - 1].right;
				expect(
					gap,
					`links "${boxes[i - 1].label}" and "${boxes[i].label}" touch at ${vp.width}px`
				).toBeGreaterThanOrEqual(8);
			}
		}
	});

	test('active nav link is still identified', async ({ page }) => {
		await page.setViewportSize(REQUIRED_VIEWPORTS[4]);
		await page.goto('/proyectos');
		const nav = page.locator('.toolbar-nav');
		const active = nav.locator('a.active');
		await expect(active).toHaveCount(1);
		await expect(active).toHaveAttribute('aria-current', 'page');
	});

	test('project cards keep consistent horizontal inner padding', async ({ page }) => {
		await page.goto('/proyectos');
		const cards = page.locator('article.project');
		await expect(cards.first()).toBeVisible();
		const paddings = await cards.evaluateAll((els) =>
			els.map((el) => {
				const s = getComputedStyle(el);
				return { left: parseFloat(s.paddingLeft), right: parseFloat(s.paddingRight) };
			})
		);
		expect(paddings.length).toBeGreaterThan(1);
		for (const p of paddings) {
			expect(p.left, 'card content hugs the left edge').toBeGreaterThanOrEqual(16);
			expect(p.right, 'card content hugs the right edge').toBeGreaterThanOrEqual(16);
			expect(p.left).toBe(p.right);
		}
	});

	test('related project cards on detail pages keep horizontal padding', async ({ page }) => {
		await page.goto('/proyectos');
		const href = await page.locator('article.project a.project-link').first().getAttribute('href');
		expect(href).toBeTruthy();
		await page.goto(new URL(href!, 'http://localhost').pathname);
		const related = page.locator('article.project');
		const count = await related.count();
		if (count > 0) {
			const p = await related.first().evaluate((el) => {
				const s = getComputedStyle(el);
				return { left: parseFloat(s.paddingLeft), right: parseFloat(s.paddingRight) };
			});
			expect(p.left).toBeGreaterThanOrEqual(16);
			expect(p.right).toBeGreaterThanOrEqual(16);
		}
	});

	test('icons render at visible size without clipping their glyphs', async ({ page }) => {
		await page.goto('/');
		const icons = page.locator('.material-symbols-outlined');
		const count = await icons.count();
		expect(count, 'expected material symbols on the page').toBeGreaterThan(0);
		for (let i = 0; i < Math.min(count, 8); i++) {
			const m = await icons.nth(i).evaluate((el) => {
				const s = getComputedStyle(el);
				const r = el.getBoundingClientRect();
				return {
					w: r.width,
					h: r.height,
					fontSize: parseFloat(s.fontSize),
					overflow: s.overflow,
					color: s.color
				};
			});
			expect(m.w, `icon ${i} too narrow`).toBeGreaterThanOrEqual(m.fontSize * 0.9);
			expect(m.h, `icon ${i} too short`).toBeGreaterThanOrEqual(m.fontSize * 0.9);
			// overflow:hidden on a 1em box clips the font's line box (~10% taller)
			expect(m.overflow, `icon ${i} clips its glyph`).not.toBe('hidden');
		}
	});

	test('section kicker markers are painted, not collapsed', async ({ page }) => {
		await page.goto('/');
		const marker = await page
			.locator('.kicker')
			.first()
			.evaluate((el) => {
				const b = getComputedStyle(el, '::before');
				return {
					display: b.display,
					width: parseFloat(b.width),
					height: parseFloat(b.height),
					background: b.backgroundColor
				};
			});
		expect(marker.display).toBe('inline-block');
		expect(marker.width).toBeGreaterThan(0);
		expect(marker.height).toBeGreaterThan(0);
		expect(marker.background).not.toBe('rgba(0, 0, 0, 0)');
		expect(marker.background).not.toBe('transparent');
	});

	test('no horizontal overflow on required viewports', async ({ page }) => {
		const pages = ['/', '/proyectos', '/experiencia', '/cv', '/habilidades'];
		// add one project detail and one skill detail page
		await page.setViewportSize(REQUIRED_VIEWPORTS[4]);
		await page.goto('/proyectos');
		const projectHref = await page
			.locator('article.project a.project-link')
			.first()
			.getAttribute('href');
		await page.goto('/habilidades');
		const skillHref = await page.locator('.skill-card').first().getAttribute('href');
		if (projectHref) pages.push(new URL(projectHref, 'http://localhost').pathname);
		if (skillHref) pages.push(new URL(skillHref, 'http://localhost').pathname);

		for (const vp of REQUIRED_VIEWPORTS) {
			await page.setViewportSize(vp);
			for (const path of pages) {
				await page.goto(path);
				await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth
				);
				expect(overflow, `horizontal overflow at ${vp.width}px on ${path}`).toBeLessThanOrEqual(1);
			}
		}
	});
});
