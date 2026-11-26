import type { APIRequestContext, Page } from '@playwright/test';
import { ADMIN_E2E_HEADER, ADMIN_E2E_SECRET } from '../support/admin';
import { expect, test } from '../support/test';

// The admin seam is serial: these tests create and delete the same temporary
// project, so running them concurrently would race on the shared local D1.
test.describe.configure({ mode: 'serial' });

const E2E_SLUG = 'e2e-editor-check';
// Admin API base URL must match playwright.config.ts ADMIN_BASE_URL (IPv4 only).
const ADMIN_BASE_URL = 'http://127.0.0.1:5173';

function projectDocument(slug: string): string {
	return JSON.stringify(
		{
			slug,
			title: 'Proyecto E2E',
			area: 'dev',
			year: '2026',
			role: 'Prueba automatizada',
			summary: 'Proyecto temporal creado por Playwright y eliminado al terminar.',
			stack: ['Svelte'],
			skills: ['Testing'],
			highlights: ['No se publica ni se conserva tras la prueba.']
		},
		null,
		2
	);
}

const adminHeaders = { [ADMIN_E2E_HEADER]: ADMIN_E2E_SECRET };

async function gotoAdmin(page: Page, path: string): Promise<void> {
	await page.goto(path, { waitUntil: 'domcontentloaded' });
	// Ensure the admin shell has hydrated before interacting with the page.
	await expect(page.getByText('Sesión autenticada')).toBeVisible();
	await page.waitForLoadState('networkidle');
}

async function deleteProject(request: APIRequestContext, slug: string): Promise<void> {
	await request
		.post('/admin/proyectos?/delete', {
			form: { slug },
			headers: { ...adminHeaders, Origin: ADMIN_BASE_URL },
			maxRedirects: 0
		})
		.catch(() => {});
}

test.beforeEach(async ({ context, request }) => {
	// The project-level seam header is also sent to third-party font requests,
	// where it triggers CORS preflights. These tests do not assert typography,
	// so serve the fallback fonts instead of stalling page load.
	await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
	await deleteProject(request, E2E_SLUG);
});

test.afterEach(async ({ request }) => {
	await deleteProject(request, E2E_SLUG);
});

test('loads the editors with a local authenticated session', async ({ page }) => {
	await gotoAdmin(page, '/admin/proyectos');
	await expect(page.getByRole('heading', { name: 'Proyectos', level: 1 })).toBeVisible();
	await expect(page.getByText('Sesión autenticada')).toBeVisible();
	await expect(page.getByText('e2e@localhost')).toBeVisible();
});

test('warns before switching project with unsaved changes', async ({ page }) => {
	await gotoAdmin(page, '/admin/proyectos');
	const editor = page.locator('#content_es');
	await expect(editor).not.toHaveValue('');

	const original = await editor.inputValue();
	const modified = original.replace('"title"', '"title" ');
	await editor.fill(modified);
	await expect(page.getByText('Cambios sin guardar')).toBeVisible();

	page.once('dialog', (dialog) => dialog.dismiss());
	await page.getByRole('button', { name: 'Crear proyecto' }).click();
	await expect(editor).toHaveValue(modified);
	await expect(page.getByText('Cambios sin guardar')).toBeVisible();

	page.once('dialog', (dialog) => dialog.accept());
	await page.getByRole('button', { name: 'Crear proyecto' }).click();
	await expect(editor).toHaveValue(/"slug": ""/);
	await expect(page.getByText('Sin cambios pendientes')).toBeVisible();
});

test('creates a project, clears the dirty state and deletes it', async ({ page }) => {
	await gotoAdmin(page, '/admin/proyectos');
	await page.getByRole('button', { name: 'Crear proyecto' }).click();
	await page.locator('#content_es').fill(projectDocument(E2E_SLUG));
	await page.locator('#content_en').fill(projectDocument(E2E_SLUG));
	await expect(page.getByText('Cambios sin guardar')).toBeVisible();

	const saveResponse = page.waitForResponse(
		(res) => res.url().includes('/admin/proyectos?/save') && res.status() === 200
	);
	await page.getByRole('button', { name: 'Guardar proyecto' }).click();
	await saveResponse;
	await expect(page.getByText(`Project "${E2E_SLUG}" saved in D1.`)).toBeVisible({
		timeout: 10000
	});
	await expect(page.getByText('Sin cambios pendientes')).toBeVisible();
	await expect(page.getByRole('button', { name: new RegExp(E2E_SLUG) })).toBeVisible({
		timeout: 10000
	});

	page.once('dialog', (dialog) => dialog.accept());
	await page.getByRole('button', { name: 'Eliminar proyecto seleccionado' }).click();
	await expect(page.getByText(`Project "${E2E_SLUG}" deleted from D1.`)).toBeVisible();
	await expect(page.getByRole('button', { name: new RegExp(E2E_SLUG) })).toHaveCount(0);
});

test('warns before leaving the content editor with unsaved changes', async ({ page }) => {
	await gotoAdmin(page, '/admin?key=site&locale=es');
	const editor = page.locator('#content');
	await expect(editor).not.toHaveValue('');

	const original = await editor.inputValue();
	await editor.fill(original.replace('"tagline"', '"tagline" '));
	await expect(page.getByText('Cambios sin guardar')).toBeVisible();

	page.once('dialog', (dialog) => dialog.dismiss());
	await page.getByRole('link', { name: 'English' }).first().click();
	await expect(page).toHaveURL(/locale=es/);
	await expect(page.getByText('Cambios sin guardar')).toBeVisible();

	page.once('dialog', (dialog) => dialog.accept());
	await page.getByRole('link', { name: 'English' }).first().click();
	await expect(page).toHaveURL(/locale=en/);
	await expect(page.getByText('Sin cambios pendientes')).toBeVisible();
});

test('rejects unsafe slug changes and duplicate creations', async ({ page, request }) => {
	await gotoAdmin(page, '/admin/proyectos');
	const original = await page.locator('#content_es').inputValue();
	const existing = JSON.parse(original) as { slug: string };
	const renamed = { ...existing, slug: `${existing.slug}-renamed` };

	const rename = await request.post('/admin/proyectos?/save', {
		form: {
			original_slug: existing.slug,
			sort_order: '0',
			content_es: JSON.stringify(renamed),
			content_en: JSON.stringify(renamed)
		},
		headers: { ...adminHeaders, Origin: ADMIN_BASE_URL },
		maxRedirects: 0
	});
	// SvelteKit actions return HTTP 200 with { type: 'failure', status } in the body.
	const renameBody = await rename.json();
	expect(renameBody.type).toBe('failure');
	expect(renameBody.status).toBe(400);

	const duplicate = await request.post('/admin/proyectos?/save', {
		form: {
			original_slug: '',
			sort_order: '0',
			content_es: projectDocument(existing.slug),
			content_en: projectDocument(existing.slug)
		},
		headers: { ...adminHeaders, Origin: ADMIN_BASE_URL },
		maxRedirects: 0
	});
	const duplicateBody = await duplicate.json();
	expect(duplicateBody.type).toBe('failure');
	expect(duplicateBody.status).toBe(409);
});
