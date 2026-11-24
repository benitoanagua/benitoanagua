import adapter from '@sveltejs/adapter-cloudflare';
import { fileURLToPath } from 'node:url';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
			alias: {
				'$folio': fileURLToPath(new URL('./packages/folio/src/lib', import.meta.url))
			},
		adapter: adapter({
			fallback: 'plaintext',
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		})
	}
};

export default config;
