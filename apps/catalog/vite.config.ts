import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	plugins: [svelte()],
	resolve: {
		alias: {
			'$folio': fileURLToPath(new URL('../../packages/folio/src/lib', import.meta.url))
		}
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true
	}
});
