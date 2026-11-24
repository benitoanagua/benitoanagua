import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('./packages/folio/package.json', 'utf8'));
const expected = {
	name: '@benitoanagua/folio',
	sveltePeer: '^5.0.0',
	entry: './dist/index.js',
	types: './dist/index.d.ts',
	stylesheet: './dist/styles.css'
};
const contractErrors = [];
if (manifest.name !== expected.name) contractErrors.push('unexpected package name');
if (manifest.peerDependencies?.svelte !== expected.sveltePeer) {
	contractErrors.push('Svelte 5 peer dependency missing');
}
if (manifest.exports?.['.']?.svelte !== expected.entry) {
	contractErrors.push('Svelte entry export missing');
}
if (manifest.exports?.['.']?.types !== expected.types) {
	contractErrors.push('type entry export missing');
}
if (manifest.exports?.['./styles.css'] !== expected.stylesheet) {
	contractErrors.push('stylesheet export missing');
}
if (contractErrors.length) {
	console.error(`FOLIO manifest contract failed: ${contractErrors.join('; ')}`);
	process.exit(1);
}

const output = execFileSync('npm', ['pack', '--dry-run', '--json', './packages/folio'], {
	encoding: 'utf8'
});
const [pack] = JSON.parse(output);
const files = new Set(pack.files.map(({ path }) => path));
const required = [
	'package.json',
	'README.md',
	'dist/index.js',
	'dist/index.d.ts',
	'dist/styles.css'
];
const missing = required.filter((file) => !files.has(file));

if (missing.length) {
	console.error(`FOLIO package is missing required files: ${missing.join(', ')}`);
	process.exit(1);
}

console.log(`FOLIO package smoke check passed: ${pack.files.length} packed files.`);
