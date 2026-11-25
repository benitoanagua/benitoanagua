import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: [
				fileURLToPath(new URL('.', import.meta.url)),
				fileURLToPath(new URL('../packages', import.meta.url))
			]
		}
	}
});
