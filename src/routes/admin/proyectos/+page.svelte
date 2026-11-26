<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import AdminStatus from '$lib/components/admin/AdminStatus.svelte';
	import {
		formatJsonDocument,
		isProjectDraftDirty,
		type ProjectDraft
	} from '$lib/utils/editor-state';
	import { confirmDiscardChanges, useUnsavedChangesGuard } from '$lib/utils/unsaved-changes.svelte';

	type ProjectRow = PageData['projects'][number];

	let { data, form }: { data: PageData; form: ActionData } = $props();
	// Capture the first loaded record once; changing data later must not overwrite an unsaved draft.
	const initialProject = untrack(() => data.projects[0]);

	function blankDocument(order: number): ProjectDraft {
		const template = JSON.stringify(
			{
				slug: '',
				title: '',
				area: 'dev',
				year: '',
				role: '',
				summary: '',
				stack: [],
				skills: [],
				highlights: []
			},
			null,
			2
		);
		return { contentEs: template, contentEn: template, sortOrder: order, published: false };
	}

	function projectDraft(item: ProjectRow): ProjectDraft {
		return {
			contentEs: formatJsonDocument(item.content_es),
			contentEn: formatJsonDocument(item.content_en),
			sortOrder: item.sort_order,
			published: item.is_published === 1
		};
	}

	const initialDraft = untrack(() =>
		initialProject ? projectDraft(initialProject) : blankDocument(data.projects.length)
	);

	let selected = $state(initialProject?.slug ?? '');
	let es = $state(initialDraft.contentEs);
	let en = $state(initialDraft.contentEn);
	let order = $state(initialDraft.sortOrder);
	let published = $state(initialDraft.published);
	let baseline = $state<ProjectDraft>(initialDraft);

	const draft = $derived<ProjectDraft>({
		contentEs: es,
		contentEn: en,
		sortOrder: Number.isFinite(Number(order)) ? Number(order) : 0,
		published
	});
	const dirty = $derived(isProjectDraftDirty(draft, baseline));

	useUnsavedChangesGuard(() => dirty);

	function loadDraft(slug: string) {
		const item = data.projects.find((project) => project.slug === slug);
		const next = item ? projectDraft(item) : blankDocument(data.projects.length);
		selected = item?.slug ?? '';
		es = next.contentEs;
		en = next.contentEn;
		order = next.sortOrder;
		published = next.published;
		baseline = next;
	}

	function choose(slug: string) {
		if (slug === selected) return;
		if (dirty && !confirmDiscardChanges()) return;
		loadDraft(slug);
	}

	function blank() {
		if (dirty && !confirmDiscardChanges()) return;
		loadDraft('');
	}

	function currentSlug(): string | null {
		try {
			const value: unknown = JSON.parse(es);
			return typeof value === 'object' &&
				value !== null &&
				'slug' in value &&
				typeof value.slug === 'string'
				? value.slug
				: null;
		} catch {
			return null;
		}
	}
</script>

<svelte:head>
	<title>Portfolio CMS — Proyectos</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="projects-admin">
	<AdminPageHeader
		kicker="ADMINISTRACIÓN · PROYECTOS"
		title="Proyectos"
		description="Gestiona las fichas bilingües almacenadas en D1. Solo los proyectos publicados aparecen en el portfolio."
	/>

	{#if form?.message}
		<AdminStatus
			label={form.success ? 'Operación completada' : 'La operación no se completó'}
			detail={form.message}
			tone={form.success ? 'success' : 'error'}
		/>
	{/if}

	<div class="project-workspace">
		<aside class="project-list" aria-label="Listado de proyectos">
			<button class="new" type="button" onclick={blank}>Crear proyecto</button>
			<p class="label">Registros ({data.projects.length})</p>
			{#if data.projects.length === 0}
				<p class="empty">Todavía no hay proyectos. Crea el primero con el botón superior.</p>
			{/if}
			{#each data.projects as item (item.slug)}
				<button
					class="project-choice"
					class:active={selected === item.slug}
					type="button"
					aria-pressed={selected === item.slug}
					onclick={() => choose(item.slug)}
				>
					<strong>{item.slug}</strong>
					<span>{item.is_published ? 'Publicado' : 'Borrador'} · {item.area}</span>
				</button>
			{/each}
		</aside>

		<section class="editor" aria-label="Editor de proyecto">
			{#if selected}
				<p class="slug-note" id="slug-note">
					El slug <code>{selected}</code> identifica el proyecto y su URL pública. No se puede modificar
					desde el editor; para usar otro slug, crea un proyecto nuevo.
				</p>
			{/if}
			<form
				method="POST"
				action="?/save"
				use:enhance={() =>
					async ({ result, update }) => {
						await update({ reset: false });
						if (result.type === 'success') {
							const savedSlug = currentSlug();
							if (savedSlug) selected = savedSlug;
							baseline = { ...draft };
						}
					}}
			>
				<input type="hidden" name="original_slug" value={selected} />
				<div class="meta">
					<label for="sort_order">Orden de publicación</label>
					<input id="sort_order" type="number" min="0" name="sort_order" bind:value={order} />
					<label class="check" for="is_published">
						<input
							id="is_published"
							type="checkbox"
							name="is_published"
							value="1"
							bind:checked={published}
						/> Publicado
					</label>
				</div>
				<div class="localized">
					<label for="content_es">Contenido en español</label>
					<textarea id="content_es" name="content_es" bind:value={es} spellcheck="false" required
					></textarea>
					<label for="content_en">Contenido en inglés</label>
					<textarea id="content_en" name="content_en" bind:value={en} spellcheck="false" required
					></textarea>
				</div>
				<div class="actions">
					<button class="save" type="submit">Guardar proyecto</button>
					<p class="dirty-status" role="status" aria-live="polite">
						{dirty ? 'Cambios sin guardar' : 'Sin cambios pendientes'}
					</p>
				</div>
			</form>
			{#if selected}
				<form
					method="POST"
					action="?/delete"
					use:enhance
					onsubmit={(event) => {
						if (!confirm(`¿Eliminar el proyecto "${selected}" de D1?`)) event.preventDefault();
					}}
				>
					<input type="hidden" name="slug" value={selected} />
					<button class="danger" type="submit">Eliminar proyecto seleccionado</button>
				</form>
			{/if}
		</section>
	</div>
</section>

<style>
	.projects-admin {
		display: grid;
		gap: var(--space-editorial-md);
	}
	.project-workspace {
		display: grid;
		grid-template-columns: minmax(14rem, 19rem) minmax(0, 1fr);
		gap: clamp(1.5rem, 4vw, 3rem);
	}
	.project-list {
		display: grid;
		align-content: start;
		gap: var(--space-3);
	}
	.project-list > .label {
		margin: var(--space-3) 0 0;
		color: var(--color-on-surface-variant);
	}
	.project-list > .empty {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	button {
		min-height: 3rem;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-on-background);
		font: 700 1rem/1.4 var(--font-ui);
		text-align: left;
		cursor: pointer;
	}
	button:hover {
		background: var(--color-hover-surface);
	}
	.new,
	.save {
		border-color: var(--color-primary);
		background: var(--color-primary);
		color: var(--color-on-primary);
	}
	.project-choice {
		display: grid;
		gap: var(--space-2);
	}
	.project-choice span {
		color: var(--color-on-surface-variant);
		font-weight: 400;
	}
	.project-choice.active {
		border-left: 3px solid var(--color-primary);
		background: var(--color-surface-container-low);
	}
	.editor {
		min-width: 0;
		padding-top: var(--space-5);
		border-top: var(--rule-base) solid var(--color-on-background);
	}
	.slug-note {
		margin-bottom: var(--space-5);
		color: var(--color-on-surface-variant);
	}
	.slug-note code {
		font-family: var(--font-mono);
	}
	.editor form {
		display: grid;
		gap: var(--space-5);
	}
	.meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-5);
	}
	label {
		display: grid;
		gap: var(--space-2);
		font-weight: 700;
	}
	input[type='number'] {
		min-height: 3rem;
		max-width: 10rem;
		padding: var(--space-3);
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container-low);
		color: var(--color-on-background);
		font: 1rem var(--font-ui);
	}
	.check {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.check input {
		width: 1.25rem;
		height: 1.25rem;
	}
	.localized {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-5);
	}
	textarea {
		width: 100%;
		min-height: 55vh;
		resize: vertical;
		padding: var(--space-4);
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container-low);
		color: var(--color-on-background);
		font: 1rem/1.6 var(--font-mono);
	}
	.actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-4);
	}
	.dirty-status {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	.danger {
		border-width: var(--rule-thick);
		border-color: var(--color-error);
		color: var(--color-error);
	}
	@media (max-width: 850px) {
		.project-workspace,
		.localized {
			grid-template-columns: 1fr;
		}
	}
</style>
