import { error } from '@sveltejs/kit';

interface AccessEnvironment {
	ACCESS_TEAM_DOMAIN?: string;
	ACCESS_AUD?: string;
	ADMIN_EMAIL?: string;
	/**
	 * Test-only secret used by the Playwright admin project. It is never set in
	 * deployed environments and the bypass below additionally requires a
	 * loopback hostname, so a leaked value cannot unlock a public deployment.
	 */
	ADMIN_E2E_SECRET?: string;
}

const LOCAL_E2E_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
const LOCAL_E2E_SECRET_MIN_LENGTH = 32;
const LOCAL_E2E_EMAIL = 'e2e@localhost';

function isLocalE2EHost(request: Request): boolean {
	try {
		return LOCAL_E2E_HOSTS.has(new URL(request.url).hostname);
	} catch {
		return false;
	}
}

function secretsMatch(provided: string, expected: string): boolean {
	if (provided.length !== expected.length) return false;
	let difference = 0;
	for (let index = 0; index < provided.length; index++) {
		difference |= provided.charCodeAt(index) ^ expected.charCodeAt(index);
	}
	return difference === 0;
}

/**
 * Local-only authentication seam for the Playwright admin suite. It is
 * deliberately inert unless a long secret is bound *and* the request targets a
 * loopback hostname. Production and preview deployments never bind the secret.
 */
function localE2EAdmin(request: Request, env?: AccessEnvironment): { email: string } | undefined {
	const secret = env?.ADMIN_E2E_SECRET;
	if (!secret || secret.length < LOCAL_E2E_SECRET_MIN_LENGTH) return undefined;
	if (!isLocalE2EHost(request)) return undefined;
	const provided = request.headers.get('x-admin-e2e-secret');
	if (provided === null) return undefined;
	if (!secretsMatch(provided, secret)) {
		error(401, 'Local admin test credentials are invalid.');
	}
	return { email: LOCAL_E2E_EMAIL };
}

interface AccessClaims {
	iss?: string;
	aud?: string | string[];
	exp?: number;
	nbf?: number;
	email?: string;
}

interface AccessHeader {
	alg?: string;
	kid?: string;
}

interface AccessJwk extends JsonWebKey {
	kid?: string;
}

function decodeBase64Url(value: string): Uint8Array<ArrayBuffer> {
	const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
	const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

function decodeJson<T>(value: string): T {
	return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T;
}

function normalizeDomain(value: string): string {
	const domain = value
		.trim()
		.replace(/^https?:\/\//i, '')
		.replace(/\/$/, '')
		.toLowerCase();
	if (!/^[a-z0-9.-]+$/.test(domain)) throw new Error('Invalid Access team domain');
	return domain;
}

let cachedKeys: { domain: string; expiresAt: number; keys: AccessJwk[] } | undefined;

async function getAccessKeys(domain: string): Promise<AccessJwk[]> {
	if (cachedKeys?.domain === domain && cachedKeys.expiresAt > Date.now()) {
		return cachedKeys.keys;
	}
	const response = await fetch(`https://${domain}/cdn-cgi/access/certs`, {
		headers: { accept: 'application/json' }
	});
	if (!response.ok) throw new Error('Unable to retrieve Cloudflare Access signing keys');
	const body = (await response.json()) as { keys?: AccessJwk[] };
	if (!Array.isArray(body.keys) || body.keys.length === 0) {
		throw new Error('Cloudflare Access returned no signing keys');
	}
	cachedKeys = { domain, expiresAt: Date.now() + 5 * 60 * 1000, keys: body.keys };
	return body.keys;
}

/**
 * Validates the Cloudflare Access JWT at the application boundary as well as
 * requiring Access to protect /admin and its actions at the edge.
 */
export async function requireAdmin(
	request: Request,
	env?: AccessEnvironment
): Promise<{ email: string }> {
	const localAdmin = localE2EAdmin(request, env);
	if (localAdmin) return localAdmin;

	const teamDomain = env?.ACCESS_TEAM_DOMAIN;
	const audience = env?.ACCESS_AUD;
	const adminEmail = env?.ADMIN_EMAIL?.trim().toLowerCase();
	if (!teamDomain || !audience || !adminEmail) {
		error(503, 'Admin authentication is not configured.');
	}

	let domain: string;
	try {
		domain = normalizeDomain(teamDomain);
	} catch {
		error(503, 'Admin authentication configuration is invalid.');
	}

	const token = request.headers.get('Cf-Access-Jwt-Assertion');
	if (!token) error(401, 'Cloudflare Access authentication is required.');

	try {
		const parts = token.split('.');
		if (parts.length !== 3) throw new Error('Malformed JWT');
		const header = decodeJson<AccessHeader>(parts[0]);
		const claims = decodeJson<AccessClaims>(parts[1]);
		if (header.alg !== 'RS256' || !header.kid) throw new Error('Unsupported JWT');
		const key = (await getAccessKeys(domain)).find((candidate) => candidate.kid === header.kid);
		if (!key) throw new Error('Unknown signing key');
		const publicKey = await crypto.subtle.importKey(
			'jwk',
			key,
			{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
			false,
			['verify']
		);
		const validSignature = await crypto.subtle.verify(
			'RSASSA-PKCS1-v1_5',
			publicKey,
			decodeBase64Url(parts[2]),
			new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
		);
		const now = Math.floor(Date.now() / 1000);
		const validAudience = Array.isArray(claims.aud)
			? claims.aud.includes(audience)
			: claims.aud === audience;
		if (
			!validSignature ||
			claims.iss !== `https://${domain}` ||
			!validAudience ||
			typeof claims.exp !== 'number' ||
			claims.exp <= now ||
			(typeof claims.nbf === 'number' && claims.nbf > now) ||
			claims.email?.trim().toLowerCase() !== adminEmail
		) {
			throw new Error('JWT claims or signature rejected');
		}
		return { email: adminEmail };
	} catch {
		error(401, 'Cloudflare Access token is invalid or expired.');
	}
}
