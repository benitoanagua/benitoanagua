import { expect, test } from '../support/test';

const MAIN_PAGES = ['/habilidades', '/proyectos', '/experiencia', '/cv'];

test.describe('Portfolio navigation', () => {
	test('home renders header, hero and navigation', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.getByRole('banner')).toBeVisible();
		// Desktop toolbar nav is visible at the default viewport.
		await expect(
			page.getByRole('navigation', { name: /navegación|navigation/i }).first()
		).toBeVisible();
	});

	test('main nav links lead to the expected routes', async ({ page }) => {
		await page.goto('/');
		const nav = page.getByRole('navigation').first();
		for (const [label, path] of [
			['Habilidades', '/habilidades'],
			['Proyectos', '/proyectos'],
			['Experiencia', '/experiencia'],
			['CV', '/cv']
		] as const) {
			await nav.getByRole('link', { name: label, exact: true }).click();
			await expect(page).toHaveURL(new RegExp(`${path}$`));
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			await page.goto('/');
		}
	});

	for (const path of MAIN_PAGES) {
		test(`internal page ${path} loads without console errors`, async ({ page }) => {
			const errors: string[] = [];
			page.on('console', (msg) => {
				// "Failed to load resource" is covered by requestfailed below so
				// external CDN failures can be filtered by URL.
				if (msg.type() === 'error' && !msg.text().startsWith('Failed to load resource')) {
					errors.push(msg.text());
				}
			});
			page.on('pageerror', (err) => errors.push(String(err)));
			page.on('requestfailed', (req) => {
				// Aborted requests are client-side navigation cancelling in-flight
				// fetches — not failures. Google Fonts are progressive enhancement;
				// their absence must not fail the suite either.
				const aborted = req.failure()?.errorText === 'net::ERR_ABORTED';
				const fontCdn = /fonts\.(googleapis|gstatic)\.com/.test(req.url());
				if (!aborted && !fontCdn) {
					errors.push(`request failed: ${req.url()}`);
				}
			});
			await page.goto(path);
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			// Give late resource failures a chance to surface (bounded: external
			// font CDNs may hang without failing).
			await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
			expect(errors, `console errors on ${path}`).toEqual([]);
		});
	}

	test('project card links to its detail page', async ({ page }) => {
		await page.goto('/proyectos');
		const firstLink = page.locator('article.project a.project-link').first();
		await expect(firstLink).toBeVisible();
		const href = await firstLink.getAttribute('href');
		expect(href).toMatch(/^\.?\/proyectos\/.+/);
		await firstLink.click();
		const expectedPath = new URL(href!, 'http://localhost').pathname;
		await expect(page).toHaveURL(new RegExp(`${expectedPath}$`));
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('browser back/forward restores pages', async ({ page }) => {
		await page.goto('/');
		await page.goto('/experiencia');
		await expect(page).toHaveURL(/\/experiencia$/);
		await page.goBack();
		await expect(page).toHaveURL(/\/$/);
		await page.goForward();
		await expect(page).toHaveURL(/\/experiencia$/);
	});

	test('404 page renders a coherent error with way back', async ({ page }) => {
		await page.goto('/ruta-que-no-existe');
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			/404|no existe|not found|does not exist/i
		);
		await expect(page.getByRole('link').first()).toBeVisible();
	});

	test('visible nav keeps separation between links at this viewport', async ({ page }) => {
		await page.goto('/');
		// Exactly one of toolbar-nav / mobile-nav is displayed per breakpoint
		const nav = page.locator('nav:visible').first();
		await expect(nav).toBeVisible();
		const boxes = await nav.locator('a').evaluateAll((els) =>
			els.map((el) => {
				const r = el.getBoundingClientRect();
				return { left: r.left, right: r.right, label: el.textContent?.trim() ?? '' };
			})
		);
		expect(boxes.length).toBeGreaterThanOrEqual(4);
		for (let i = 1; i < boxes.length; i++) {
			const gap = boxes[i].left - boxes[i - 1].right;
			expect(
				gap,
				`links "${boxes[i - 1].label}" and "${boxes[i].label}" touch`
			).toBeGreaterThanOrEqual(8);
		}
	});

	test('skip link targets main content', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const skip = page.getByRole('link', { name: /saltar|skip/i });
		await expect(skip).toBeFocused();
		await skip.click();
		await expect(page.locator('#main')).toBeFocused();
	});
});
