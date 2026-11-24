import { execFileSync } from 'node:child_process';

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
