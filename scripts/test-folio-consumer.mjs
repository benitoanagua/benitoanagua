import { execFileSync } from 'node:child_process';
import {
	mkdtempSync,
	writeFileSync,
	rmSync,
	mkdirSync,
	readFileSync,
	existsSync,
	readdirSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();
const rootPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const temp = mkdtempSync(join(tmpdir(), 'folio-consumer-'));

try {
	// npm ≤11 prints an array; npm 12+ prints an object keyed by package name.
	const packResult = JSON.parse(
		execFileSync('npm', ['pack', './packages/folio', '--pack-destination', temp, '--json'], {
			cwd: root,
			encoding: 'utf8'
		})
	);
	const packed = Array.isArray(packResult) ? packResult[0] : Object.values(packResult)[0];
	const tarball = packed?.filename;
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
	const newline = String.fromCharCode(10);
	writeFileSync(
		join(temp, 'vite.config.js'),
		[
			"import { svelte } from '@sveltejs/vite-plugin-svelte';",
			'export default { plugins: [svelte()] };'
		].join(newline)
	);

	const src = join(temp, 'src');
	mkdirSync(src);
	writeFileSync(
		join(src, 'main.js'),
		[
			"import '@benitoanagua/folio/styles.css';",
			"import { mount } from 'svelte';",
			"import App from './App.svelte';",
			"mount(App, { target: document.getElementById('app') });"
		].join(newline)
	);
	writeFileSync(
		join(src, 'App.svelte'),
		[
			"<script>import { Button } from '@benitoanagua/folio';</script>",
			'<Button>Packaged consumer works</Button>'
		].join(newline)
	);
	writeFileSync(
		join(temp, 'tsconfig.json'),
		JSON.stringify(
			{
				compilerOptions: {
					strict: true,
					noEmit: true,
					target: 'esnext',
					module: 'esnext',
					moduleResolution: 'bundler',
					verbatimModuleSyntax: true,
					skipLibCheck: true
				},
				include: ['src']
			},
			null,
			2
		)
	);
	writeFileSync(
		join(src, 'consumer.ts'),
		[
			"import { ActionLink, Badge, Button, PageHeader, ProjectCard, TextField, Timeline } from '@benitoanagua/folio';",
			'import type {',
			'	PortfolioProject,',
			'	ProjectCardLabels,',
			'	SocialLink,',
			'	TimelineEntry',
			"} from '@benitoanagua/folio';",
			'',
			'const project: PortfolioProject = { title: ' + "'T'," + " description: 'D', href: '#' };",
			"const labels: ProjectCardLabels = { view: 'View', case: 'Case', source: 'Source', tech: 'Tech' };",
			"const links: SocialLink[] = [{ label: 'GitHub', href: 'https://example.com' }];",
			"const entries: TimelineEntry[] = [{ period: '2026', title: 'Role' }];",
			'',
			'export const contracts = { ActionLink, Badge, Button, PageHeader, ProjectCard, TextField, Timeline };',
			'export const data = { project, labels, links, entries };'
		].join(newline)
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
			`typescript@${rootPackage.devDependencies.typescript}`,
			`@sveltejs/vite-plugin-svelte@${rootPackage.devDependencies['@sveltejs/vite-plugin-svelte']}`
		],
		{ cwd: temp, stdio: 'inherit' }
	);
	execFileSync('npm', ['run', 'build'], { cwd: temp, stdio: 'inherit' });

	const builtHtml = join(temp, 'dist', 'index.html');
	if (!existsSync(builtHtml)) throw new Error('consumer build did not produce dist/index.html');
	const bundle = readdirSync(join(temp, 'dist', 'assets'))
		.filter((file) => file.endsWith('.js'))
		.map((file) => readFileSync(join(temp, 'dist', 'assets', file), 'utf8'))
		.join('\n');
	if (!bundle.includes('Packaged consumer works')) {
		throw new Error('consumer bundle does not contain the FOLIO Button output');
	}

	// The published types must resolve from the package entry point too.
	execFileSync(
		process.execPath,
		[
			join(temp, 'node_modules', 'typescript', 'bin', 'tsc'),
			'--noEmit',
			'-p',
			join(temp, 'tsconfig.json')
		],
		{ cwd: temp, stdio: 'inherit' }
	);

	console.log('FOLIO packed consumer smoke test passed (build and types).');
} finally {
	rmSync(temp, { recursive: true, force: true });
}
