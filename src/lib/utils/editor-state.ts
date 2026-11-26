/**
 * Pure helpers for the admin editors. Keeping the comparisons here makes the
 * dirty-state rules testable without a browser or a SvelteKit runtime.
 */

export interface ProjectDraft {
	contentEs: string;
	contentEn: string;
	sortOrder: number;
	published: boolean;
}

/**
 * Pretty-prints a JSON document for editing. Invalid JSON is returned as-is so
 * selecting a record never crashes the editor; the save action still rejects
 * malformed payloads.
 */
export function formatJsonDocument(value: string): string {
	try {
		return JSON.stringify(JSON.parse(value), null, 2);
	} catch {
		return value;
	}
}

export function isProjectDraftDirty(draft: ProjectDraft, baseline: ProjectDraft): boolean {
	return (
		draft.contentEs !== baseline.contentEs ||
		draft.contentEn !== baseline.contentEn ||
		draft.sortOrder !== baseline.sortOrder ||
		draft.published !== baseline.published
	);
}

export function isTextDirty(current: string, baseline: string): boolean {
	return current !== baseline;
}
