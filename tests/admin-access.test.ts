import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { requireAdmin } from '../src/lib/server/admin-access';

const SECRET = 'local-e2e-secret-'.padEnd(40, 'x');

function request(headers: Record<string, string> = {}, url = 'http://127.0.0.1:5173/admin') {
	return new Request(url, { headers });
}

async function expectStatus(promise: Promise<unknown>, status: number): Promise<void> {
	await assert.rejects(promise, (error: unknown) => {
		return (
			typeof error === 'object' &&
			error !== null &&
			'status' in error &&
			(error as { status: number }).status === status
		);
	});
}

describe('requireAdmin local E2E seam', () => {
	it('authenticates loopback requests with the configured secret', async () => {
		const admin = await requireAdmin(request({ 'x-admin-e2e-secret': SECRET }), {
			ADMIN_E2E_SECRET: SECRET
		});
		assert.deepEqual(admin, { email: 'e2e@localhost' });
	});

	it('accepts the IPv6 loopback hostname', async () => {
		const admin = await requireAdmin(
			request({ 'x-admin-e2e-secret': SECRET }, 'http://[::1]:5173/admin'),
			{ ADMIN_E2E_SECRET: SECRET }
		);
		assert.deepEqual(admin, { email: 'e2e@localhost' });
	});

	it('rejects a wrong secret on loopback', async () => {
		await expectStatus(
			requireAdmin(request({ 'x-admin-e2e-secret': `${SECRET}x` }), {
				ADMIN_E2E_SECRET: SECRET
			}),
			401
		);
	});

	it('does not activate without the secret binding', async () => {
		await expectStatus(requireAdmin(request({ 'x-admin-e2e-secret': SECRET }), {}), 503);
	});

	it('ignores short secrets', async () => {
		await expectStatus(
			requireAdmin(request({ 'x-admin-e2e-secret': 'short' }), {
				ADMIN_E2E_SECRET: 'short'
			}),
			503
		);
	});

	it('requires the header even when the secret is configured', async () => {
		await expectStatus(requireAdmin(request(), { ADMIN_E2E_SECRET: SECRET }), 503);
	});

	it('never activates on a public hostname', async () => {
		await expectStatus(
			requireAdmin(
				request({ 'x-admin-e2e-secret': SECRET }, 'https://benitoanagua.pages.dev/admin'),
				{ ADMIN_E2E_SECRET: SECRET }
			),
			503
		);
	});
});
