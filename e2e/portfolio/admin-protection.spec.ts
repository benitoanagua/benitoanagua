import { expect, test } from '../support/test';

/**
 * The admin area is protected by Cloudflare Access at the edge and by the
 * application-level JWT check. This test intentionally sends no Access token:
 * the response must be an auth/configuration error, never the editor.
 */
for (const path of ['/admin', '/admin/dashboard', '/admin/proyectos']) {
	test(`${path} rejects requests without a Cloudflare Access token`, async ({ request }) => {
		const response = await request.get(path);
		expect([401, 503]).toContain(response.status());
		const body = await response.text();
		expect(body).not.toContain('Guardar proyecto');
		expect(body).not.toContain('Guardar documento');
		expect(body).not.toContain('Sesión autenticada');
	});
}
