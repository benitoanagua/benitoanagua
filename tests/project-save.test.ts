import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { D1DatabaseLike, D1PreparedStatementLike } from '../src/lib/types/Portfolio';
import { saveProject } from '../src/lib/server/project-save';

const validProject = {
	slug: 'demo',
	title: 'Demo',
	area: 'dev',
	year: '2026',
	role: 'role',
	summary: 'summary',
	stack: ['TS'],
	skills: ['Svelte'],
	highlights: ['h']
};

interface StatementLog {
	query: string;
	values: unknown[];
}

function mockDb(existingSlugs: string[] = [], insertConflict = false) {
	const log: StatementLog[] = [];
	const db: D1DatabaseLike = {
		prepare(query) {
			const entry: StatementLog = { query, values: [] };
			log.push(entry);
			const statement = {
				bind(...values: unknown[]) {
					entry.values = values;
					return statement;
				},
				all: async () => ({ results: [] }),
				first: async () => {
					const slug = String(entry.values[0]);
					return existingSlugs.includes(slug) ? { slug } : null;
				},
				run: async () => {
					if (entry.query.includes('INSERT INTO portfolio_projects') && insertConflict) {
						throw new Error('UNIQUE constraint failed: portfolio_projects.slug');
					}
					const changes = entry.query.includes('UPDATE portfolio_projects')
						? Number(existingSlugs.includes(String(entry.values.at(-1))))
						: 1;
					return { results: [], meta: { changes } };
				}
			};
			return statement as unknown as D1PreparedStatementLike;
		}
	};
	return { db, log };
}

function projectForm(overrides: Record<string, string> = {}) {
	const form = new FormData();
	form.set('content_es', JSON.stringify(validProject));
	form.set('content_en', JSON.stringify({ ...validProject, title: 'Demo EN' }));
	form.set('original_slug', '');
	form.set('sort_order', '3');
	for (const [key, value] of Object.entries(overrides)) form.set(key, value);
	return form;
}

function writes(log: StatementLog[]) {
	return log.filter((entry) => entry.query.includes('INSERT INTO portfolio_projects') || entry.query.includes('UPDATE portfolio_projects'));
}

describe('saveProject', () => {
	it('creates a new project and writes the validated payload to D1', async () => {
		const { db, log } = mockDb();
		const result = await saveProject(db, projectForm());
		assert.equal(result.ok, true);
		if (result.ok) assert.equal(result.slug, 'demo');
		assert.equal(writes(log).length, 1);
		const values = writes(log)[0].values;
		assert.deepEqual(values.slice(0, 6), ['demo', 'dev', '2026', 0, null, 3]);
		assert.equal(values[8], 0);
	});

	it('updates an existing project when the slug is unchanged', async () => {
		const { db, log } = mockDb(['demo']);
		const result = await saveProject(
			db,
			projectForm({
				original_slug: 'demo',
				is_published: '1'
			})
		);
		assert.equal(result.ok, true);
		assert.equal(writes(log).length, 1);
		assert.match(writes(log)[0].query, /^UPDATE portfolio_projects/);
		assert.equal(writes(log)[0].values[7], 1);
	});

	it('rejects creating a duplicate slug without writing', async () => {
		const { db, log } = mockDb(['demo']);
		const result = await saveProject(db, projectForm());
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.status, 409);
		assert.equal(writes(log).length, 0);
	});

	it('rejects a duplicate slug created after the pre-check without overwriting it', async () => {
		const { db, log } = mockDb([], true);
		const result = await saveProject(db, projectForm());
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.status, 409);
		assert.equal(writes(log).length, 1);
		assert.match(writes(log)[0].query, /^INSERT INTO portfolio_projects/);
	});

	it('rejects renaming an existing project without writing', async () => {
		const { db, log } = mockDb(['demo']);
		const result = await saveProject(
			db,
			projectForm({
				original_slug: 'demo',
				content_es: JSON.stringify({ ...validProject, slug: 'renamed' }),
				content_en: JSON.stringify({ ...validProject, slug: 'renamed' })
			})
		);
		assert.equal(result.ok, false);
		if (!result.ok) {
			assert.equal(result.status, 400);
			assert.match(result.message, /cannot be changed/);
		}
		assert.equal(writes(log).length, 0);
	});

	it('rejects saving a project that no longer exists without writing', async () => {
		const { db, log } = mockDb();
		const result = await saveProject(db, projectForm({ original_slug: 'demo' }));
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.status, 409);
		assert.equal(writes(log).length, 0);
	});

	it('rejects an invalid original slug before touching D1', async () => {
		const { db, log } = mockDb();
		const result = await saveProject(db, projectForm({ original_slug: '../demo' }));
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.status, 400);
		assert.equal(log.length, 0);
	});

	it('rejects invalid JSON before touching D1', async () => {
		const { db, log } = mockDb();
		const result = await saveProject(db, projectForm({ content_es: '{nope' }));
		assert.equal(result.ok, false);
		if (!result.ok) assert.match(result.message, /valid JSON/);
		assert.equal(log.length, 0);
	});

	it('rejects malformed optional fields before touching D1', async () => {
		const { db, log } = mockDb();
		const result = await saveProject(
			db,
			projectForm({
				content_es: JSON.stringify({ ...validProject, links: { repo: 42 } })
			})
		);
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.status, 400);
		assert.equal(log.length, 0);
	});

	it('rejects localized documents whose required fields do not match', async () => {
		const { db, log } = mockDb();
		const result = await saveProject(
			db,
			projectForm({
				content_en: JSON.stringify({ ...validProject, area: 'games' })
			})
		);
		assert.equal(result.ok, false);
		if (!result.ok) assert.match(result.message, /must match/);
		assert.equal(log.length, 0);
	});

	it('normalizes an invalid sort order to the end of the list', async () => {
		const { db, log } = mockDb();
		const result = await saveProject(db, projectForm({ sort_order: 'not-a-number' }));
		assert.equal(result.ok, true);
		assert.equal(writes(log)[0].values[5], 9999);
	});

	it('requires both localized documents and the original slug field', async () => {
		const { db, log } = mockDb();
		const form = new FormData();
		const result = await saveProject(db, form);
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.status, 400);
		assert.equal(log.length, 0);
	});
});
