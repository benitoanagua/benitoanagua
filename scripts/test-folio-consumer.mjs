import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();
const rootPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const temp = mkdtempSync(join(tmpdir(), 'folio-consumer-'));

try {
	const packed = JSON.parse(
		execFileSync(
			'npm',
			['pack', './packages/folio', '--pack-destination', temp, '--json'],
			{ cwd: root, encoding: 'utf8' }
		)
	);
	const tarball = packed[0]?.filename;
	if (!tarball) throw new Error('npm pack did not return a tarball filename');

	writeFileSync(
		join(temp, 'package.json'),
		JSON.stringify(
			{
				name: 'folio-consumer-smoke',
				private: true,
				type: 'module',
				scripts: { build: 'vite build' }
			},
			null,
			2
		)
	);
	writeFileSync(
		join(temp, 'index.html'),
		'<div id="app"></div><script type="module" src="/src/main.js"></script>'
	);
	writeFileSync(
		join(temp, 'vite.config.js'),
		"import { svelte } from '@sveltejs/vite-plugin-svelte';\nexport default { plugins: [svelte()] };\n"
	);

	const src = join(temp, 'src');
	mkdirSync(src);
	writeFileSync(
		join(src, 'main.js'),
		"import '@benitoanagua/folio/styles.css';\nimport { mount } from 'svelte';\nimport App from './App.svelte';\nmount(App, { target: document.getElementById('app') });\n"
	);
	writeFileSync(
		join(src, 'App.svelte'),
		"<script>import { Button } from '@benitoanagua/folio';</script>\n<Button>Packaged consumer works</Button>\n"
	);

	const packageTar = join(temp, tarball);
	execFileSync(
		'npm',
		[
			'install',
			'--no-audit',
			'--no-fund',
			packageTar,
			`svelte@${rootPackage.devDependencies.svelte}`,
			`vite@${rootPackage.devDependencies.vite}`,
			`@sveltejs/vite-plugin-svelte@${rootPackage.devDependencies['@sveltejs/vite-plugin-svelte']}`
		],
		{ cwd: temp, stdio: 'inherit' }
	);
	execFileSync('npm', ['run', 'build'], { cwd: temp, stdio: 'inherit' });
	console.log('FOLIO consumer smoke test passed: packed library installed and built in an isolated Svelte 5 app.');
} finally {
	rmSync(temp, { recursive: true, force: true });
}
