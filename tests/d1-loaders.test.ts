import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadPortfolioContent, loadCvDocuments } from '../src/lib/server/portfolio-content';
import { loadPublicProjects } from '../src/lib/server/public-projects';
import type { D1DatabaseLike, D1PreparedStatementLike } from '../src/lib/types/Portfolio';

function statement(results: unknown[] | Error): D1PreparedStatementLike {
	return {
		bind: () => statement(results),
		all: async <T = unknown>() => {
			if (results instanceof Error) throw results;
			return { results: results as T[] };
		},
		first: async <T = unknown>() => null as T | null,
		run: async <T = unknown>() => ({ results: [] as T[] })
	};
}

function db(results: unknown[] | Error): D1DatabaseLike {
	return { prepare: () => statement(results) };
}

function platform(database?: D1DatabaseLike): App.Platform {
	return { env: database ? { DB: database } : {} } as App.Platform;
}

const validCv = {
	personal: { name: 'Test Person' },
	education: [],
	focuses: [{ name: 'dev', title: 'Dev', skills: [] }]
};
const validSite = {
	meta: { tagline: 't', description: 'd' },
	nav: {},
	home: {},
	footer: {}
};
const validStories = { svelte: 'story' };

function contentRows() {
	return (['es', 'en'] as const).flatMap((locale) =>
		[
			['cv', validCv],
			['site', validSite],
			['skill_stories', validStories]
		].map(([key, payload]) => ({
			locale,
			content_key: key,
			payload_json: JSON.stringify(payload)
		}))
	);
}

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

describe('loadPortfolioContent', () => {
	it('rejects when the DB binding is missing', async () => {
		await assert.rejects(() => loadPortfolioContent(platform()), /D1 binding DB is unavailable/);
		await assert.rejects(() => loadPortfolioContent(undefined), /D1 binding DB is unavailable/);
	});

	it('rejects when the query fails', async () => {
		await assert.rejects(
			() => loadPortfolioContent(platform(db(new Error('boom')))),
			/D1 read failed/
		);
	});

	it('rejects when content rows are missing', async () => {
		await assert.rejects(() => loadPortfolioContent(platform(db([]))), /Expected 6/);
	});

	it('rejects on invalid JSON payload', async () => {
		const rows = contentRows();
		rows[0].payload_json = '{nope';
		await assert.rejects(() => loadPortfolioContent(platform(db(rows))), /Invalid or unparsable/);
	});

	it('rejects on payload that fails structural validation', async () => {
		const rows = contentRows();
		rows[0].payload_json = JSON.stringify({ personal: {} });
		await assert.rejects(() => loadPortfolioContent(platform(db(rows))), /Invalid or unparsable/);
	});

	it('assembles localized content from valid rows', async () => {
		const content = await loadPortfolioContent(platform(db(contentRows())));
		assert.equal(content.cv.es.personal.name, 'Test Person');
		assert.equal(content.site.en.meta.tagline, 't');
		assert.equal(content.skillStories.svelte?.es, 'story');
		assert.equal(content.skillStories.svelte?.en, 'story');
	});
});

describe('loadCvDocuments', () => {
	const docRow = {
		locale: 'es',
		document_key: 'dev',
		label: 'Dev CV',
		public_path: '/cv/dev.pdf',
		mime_type: 'application/pdf',
		sort_order: 1
	};

	it('rejects when no current documents exist', async () => {
		await assert.rejects(() => loadCvDocuments(platform(db([]))), /No current CV documents/);
	});

	it('reuses the seeded locale for the missing one', async () => {
		const docs = await loadCvDocuments(platform(db([docRow])));
		assert.equal(docs.es.length, 1);
		assert.equal(docs.en.length, 1);
		assert.equal(docs.en[0].key, 'dev');
	});

	it('rejects on malformed document rows', async () => {
		await assert.rejects(
			() => loadCvDocuments(platform(db([{ ...docRow, public_path: 42 }]))),
			/Invalid CV document row/
		);
	});
});

describe('loadPublicProjects', () => {
	const projectRow = {
		slug: 'demo',
		sort_order: 0,
		content_es: JSON.stringify(validProject),
		content_en: JSON.stringify({ ...validProject, title: 'Demo EN' }),
		is_published: 1
	};

	it('rejects when the DB binding is missing', async () => {
		await assert.rejects(() => loadPublicProjects(platform()), /D1 binding DB is unavailable/);
	});

	it('rejects when the query fails', async () => {
		await assert.rejects(
			() => loadPublicProjects(platform(db(new Error('boom')))),
			/D1 read failed/
		);
	});

	it('returns empty lists for an empty table', async () => {
		const projects = await loadPublicProjects(platform(db([])));
		assert.deepEqual(projects, { es: [], en: [] });
	});

	it('skips unpublished rows even if returned', async () => {
		const projects = await loadPublicProjects(platform(db([{ ...projectRow, is_published: 0 }])));
		assert.deepEqual(projects, { es: [], en: [] });
	});

	it('returns localized projects for published rows', async () => {
		const projects = await loadPublicProjects(platform(db([projectRow])));
		assert.equal(projects.es[0].title, 'Demo');
		assert.equal(projects.en[0].title, 'Demo EN');
	});

	it('rejects on invalid published payloads', async () => {
		await assert.rejects(
			() => loadPublicProjects(platform(db([{ ...projectRow, content_es: '{bad' }]))),
			/Invalid JSON payload/
		);
		await assert.rejects(
			() =>
				loadPublicProjects(
					platform(db([{ ...projectRow, content_en: JSON.stringify({ slug: 'other' }) }]))
				),
			/failed validation/
		);

		for (const optionalFields of [
			{ context: 12 },
			{ result: false },
			{ links: 'https://example.com' },
			{ links: { repo: 7 } },
			{ links: { demo: null } }
		]) {
			await assert.rejects(
				() =>
					loadPublicProjects(
						platform(
							db([
							{
								...projectRow,
								content_es: JSON.stringify({ ...validProject, ...optionalFields })
							}
						])
					)
					),
				/failed validation/
			);
		}
	});
});
