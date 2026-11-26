import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	isProjectSlug,
	parseProjectDocuments,
	parseProjectPayload
} from '../src/lib/server/project-payload';
import { normalizeSortOrder, validateSlugChange } from '../src/lib/server/project-save';
import {
	formatJsonDocument,
	isProjectDraftDirty,
	isTextDirty,
	type ProjectDraft
} from '../src/lib/utils/editor-state';

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

const withOptional = {
	...validProject,
	featured: true,
	status: 'done',
	context: 'Project context',
	result: 'Project result',
	links: {
		repo: 'https://github.com/example/demo',
		demo: 'https://example.com',
		case: 'https://example.com/case'
	}
};

describe('parseProjectPayload', () => {
	it('accepts a valid payload without optional fields', () => {
		assert.deepEqual(parseProjectPayload(validProject), validProject);
	});

	it('accepts a valid payload with every optional field', () => {
		assert.deepEqual(parseProjectPayload(withOptional), withOptional);
	});

	it('accepts an empty links object', () => {
		const payload = { ...validProject, links: {} };
		assert.deepEqual(parseProjectPayload(payload), payload);
	});

	it('accepts an explicit expected slug that matches', () => {
		assert.deepEqual(parseProjectPayload(validProject, 'demo'), validProject);
	});

	it('rejects a payload whose slug differs from the expected row slug', () => {
		assert.equal(parseProjectPayload(validProject, 'other'), null);
	});

	for (const [name, value] of [
		['non-object', 42],
		['null', null],
		['array', []],
		['missing title', { ...validProject, title: undefined }],
		['blank title', { ...validProject, title: '   ' }],
		['invalid slug', { ...validProject, slug: 'Not A Slug' }],
		['invalid area', { ...validProject, area: 'other' }],
		['invalid status', { ...validProject, status: 'pending' }],
		['non-boolean featured', { ...validProject, featured: 1 }],
		['non-array stack', { ...validProject, stack: 'TS' }],
		['non-string stack item', { ...validProject, stack: [1] }],
		['non-array highlights', { ...validProject, highlights: null }]
	] as const) {
		it(`rejects ${name}`, () => {
			assert.equal(parseProjectPayload(value), null);
		});
	}

	for (const [name, optionalFields] of [
		['numeric context', { context: 12 }],
		['boolean context', { context: true }],
		['array context', { context: ['text'] }],
		['object context', { context: { text: 'value' } }],
		['null context', { context: null }],
		['numeric result', { result: 12 }],
		['boolean result', { result: false }],
		['array result', { result: [] }],
		['object result', { result: { text: 'value' } }],
		['null result', { result: null }],
		['string links', { links: 'https://example.com' }],
		['numeric links', { links: 7 }],
		['null links', { links: null }],
		['array links', { links: [] }],
		['numeric repo', { links: { repo: 1 } }],
		['null repo', { links: { repo: null } }],
		['array repo', { links: { repo: [] } }],
		['numeric demo', { links: { demo: 1 } }],
		['boolean demo', { links: { demo: false } }],
		['object demo', { links: { demo: { href: 'https://example.com' } } }],
		['numeric case', { links: { case: 1 } }],
		['boolean case', { links: { case: true } }],
		['null case', { links: { case: null } }],
		['array case', { links: { case: [] } }],
		['unknown link key', { links: { repo: 'https://github.com/example/demo', other: 'x' } }]
	] as const) {
		it(`rejects ${name}`, () => {
			assert.equal(parseProjectPayload({ ...validProject, ...optionalFields }), null);
		});
	}
});

describe('parseProjectDocuments', () => {
	it('parses two matching localized documents', () => {
		const result = parseProjectDocuments(
			JSON.stringify(validProject),
			JSON.stringify({ ...validProject, title: 'Demo EN' })
		);
		assert.equal(result.ok, true);
		if (result.ok) {
			assert.equal(result.es.title, 'Demo');
			assert.equal(result.en.title, 'Demo EN');
		}
	});

	it('rejects invalid JSON', () => {
		const result = parseProjectDocuments('{nope', JSON.stringify(validProject));
		assert.equal(result.ok, false);
		if (!result.ok) assert.match(result.message, /valid JSON/);
	});

	it('rejects localized slugs that do not match', () => {
		const result = parseProjectDocuments(
			JSON.stringify(validProject),
			JSON.stringify({ ...validProject, slug: 'other' })
		);
		assert.equal(result.ok, false);
		if (!result.ok) assert.match(result.message, /localized slugs/);
	});

	it('rejects locale fields that must match', () => {
		const result = parseProjectDocuments(
			JSON.stringify(validProject),
			JSON.stringify({ ...validProject, area: 'games' })
		);
		assert.equal(result.ok, false);
		if (!result.ok) assert.match(result.message, /must match/);
	});

	it('does not echo payload content in validation errors', () => {
		const secret = 'do-not-echo-this-value';
		const result = parseProjectDocuments(
			JSON.stringify({ ...validProject, links: { repo: { href: secret } } }),
			JSON.stringify(validProject)
		);
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.message.includes(secret), false);
	});
});

describe('validateSlugChange', () => {
	it('allows creating a new slug that is not in D1', () => {
		assert.deepEqual(validateSlugChange({ originalSlug: '', nextSlug: 'new', existing: false }), {
			ok: true
		});
	});

	it('rejects creating a slug that already exists', () => {
		const result = validateSlugChange({ originalSlug: '', nextSlug: 'demo', existing: true });
		assert.equal(result.ok, false);
		if (!result.ok) {
			assert.equal(result.status, 409);
			assert.match(result.message, /already exists/);
		}
	});

	it('allows saving an existing project without changing its slug', () => {
		assert.deepEqual(
			validateSlugChange({ originalSlug: 'demo', nextSlug: 'demo', existing: true }),
			{ ok: true }
		);
	});

	it('rejects renaming the slug of an existing project', () => {
		const result = validateSlugChange({
			originalSlug: 'demo',
			nextSlug: 'renamed',
			existing: true
		});
		assert.equal(result.ok, false);
		if (!result.ok) {
			assert.equal(result.status, 400);
			assert.match(result.message, /cannot be changed/);
		}
	});

	it('rejects saving an existing project that disappeared from D1', () => {
		const result = validateSlugChange({ originalSlug: 'demo', nextSlug: 'demo', existing: false });
		assert.equal(result.ok, false);
		if (!result.ok) assert.equal(result.status, 409);
	});
});

describe('isProjectSlug', () => {
	it('accepts lowercase kebab-case slugs', () => {
		for (const slug of ['demo', 'project-2', 'a1-b2']) assert.equal(isProjectSlug(slug), true);
	});

	it('rejects unsafe or non-canonical slugs', () => {
		for (const slug of ['', 'Demo', 'demo_2', '-demo', 'demo-', 'demo--x', 'demo/2']) {
			assert.equal(isProjectSlug(slug), false);
		}
	});
});

describe('normalizeSortOrder', () => {
	it('accepts non-negative integers', () => {
		assert.equal(normalizeSortOrder('0'), 0);
		assert.equal(normalizeSortOrder('12'), 12);
	});

	it('falls back to the end of the list for invalid values', () => {
		for (const value of [null, '', '-1', '1.5', 'nope']) {
			assert.equal(normalizeSortOrder(value), 9999);
		}
	});
});

describe('editor state helpers', () => {
	const baseline: ProjectDraft = {
		contentEs: '{}',
		contentEn: '{}',
		sortOrder: 1,
		published: false
	};

	it('formats valid JSON and preserves invalid text', () => {
		assert.equal(formatJsonDocument('{"a":1}'), '{\n  "a": 1\n}');
		assert.equal(formatJsonDocument('{nope'), '{nope');
	});

	it('is not dirty when the draft matches the baseline', () => {
		assert.equal(isProjectDraftDirty({ ...baseline }, baseline), false);
	});

	it('detects a change in any editor field', () => {
		assert.equal(isProjectDraftDirty({ ...baseline, contentEs: '{"a":2}' }, baseline), true);
		assert.equal(isProjectDraftDirty({ ...baseline, contentEn: '{"a":2}' }, baseline), true);
		assert.equal(isProjectDraftDirty({ ...baseline, sortOrder: 2 }, baseline), true);
		assert.equal(isProjectDraftDirty({ ...baseline, published: true }, baseline), true);
	});

	it('returns to clean when a change is reverted', () => {
		assert.equal(isProjectDraftDirty({ ...baseline }, baseline), false);
	});

	it('compares text documents by content', () => {
		assert.equal(isTextDirty('same', 'same'), false);
		assert.equal(isTextDirty('changed', 'same'), true);
	});
});
