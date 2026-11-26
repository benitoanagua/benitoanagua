<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import AdminStatus from '$lib/components/admin/AdminStatus.svelte';
	import AdminDocumentNav from '$lib/components/admin/AdminDocumentNav.svelte';
	import { isTextDirty } from '$lib/utils/editor-state';
	import { useUnsavedChangesGuard } from '$lib/utils/unsaved-changes.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const selectionKey = $derived(`${data.selection.key}:${data.selection.locale}`);
	let edits = $state<Record<string, string>>({});
	const currentEdit = $derived(edits[selectionKey]);
	const content = $derived(currentEdit ?? data.contentJson);
	const dirty = $derived(currentEdit !== undefined && isTextDirty(currentEdit, data.contentJson));

	useUnsavedChangesGuard(() => dirty);
</script>

<svelte:head>
	<title>Portfolio CMS — Editor de contenido</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="content-admin">
	<AdminPageHeader
		kicker="ADMINISTRACIÓN · CONTENIDO"
		title="Editor de contenido"
		description="Edita los documentos localizados que alimentan el portfolio. Los cambios se guardan en Cloudflare D1."
	/>

	{#if form?.message}
		<AdminStatus
			label={form.success ? 'Guardado correctamente' : 'No se pudo guardar'}
			detail={form.message}
			tone={form.success ? 'success' : 'error'}
		/>
	{/if}

	<div class="document-context">
		<div>
			<p class="label">Documento seleccionado</p>
			<h2>{data.selection.key} <span>/ {data.selection.locale}</span></h2>
			<p class="updated">Última actualización: {data.updatedAt ?? 'Sin registro'}</p>
		</div>
		<AdminStatus label="D1" detail="Conectado a datos persistentes" tone="success" />
	</div>

	<AdminDocumentNav
		selectedKey={data.selection.key}
		selectedLocale={data.selection.locale}
		baseHref={resolve('/admin')}
	/>

	<section class="editor" aria-labelledby="json-editor-title">
		<div class="editor-heading">
			<h2 id="json-editor-title">Contenido JSON</h2>
			<p>Conserva la estructura del documento y valida el JSON antes de guardar.</p>
		</div>
		<form
			method="POST"
			action="?/save"
			use:enhance={() =>
				async ({ formData, result, update }) => {
					await update({ reset: false });
					if (result.type === 'success') {
						const key = formData.get('key');
						const locale = formData.get('locale');
						if (typeof key === 'string' && typeof locale === 'string') {
							const next = { ...edits };
							delete next[`${key}:${locale}`];
							edits = next;
						}
					}
				}}
		>
			<input type="hidden" name="key" value={data.selection.key} />
			<input type="hidden" name="locale" value={data.selection.locale} />
			<label for="content">Documento completo</label>
			<textarea
				id="content"
				name="content"
				value={content}
				oninput={(event) => (edits[selectionKey] = event.currentTarget.value)}
				spellcheck="false"
				required
			></textarea>
			<div class="actions">
				<p>Revisa los cambios antes de enviarlos a la base de datos.</p>
				<button type="submit">Guardar documento</button>
				<p class="dirty-status" role="status" aria-live="polite">
					{dirty ? 'Cambios sin guardar' : 'Sin cambios pendientes'}
				</p>
			</div>
		</form>
	</section>
</section>

<style>
	.content-admin {
		display: grid;
		gap: var(--space-editorial-md);
	}
	.document-context {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-6);
		padding-block: var(--space-5);
		border-bottom: var(--rule-base) solid var(--color-rule-subtle);
	}
	.document-context h2 {
		margin: var(--space-2) 0;
		font-family: var(--font-display);
		font-size: var(--text-section);
		line-height: var(--leading-section);
	}
	.document-context h2 span {
		color: var(--color-on-surface-variant);
	}
	.document-context .label {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	.updated {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	.editor {
		padding-top: var(--space-6);
		border-top: var(--rule-base) solid var(--color-on-background);
	}
	.editor-heading {
		margin-bottom: var(--space-5);
	}
	.editor-heading h2 {
		margin: 0 0 var(--space-2);
		font-family: var(--font-display);
		font-size: var(--text-section);
	}
	.editor-heading p {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	form {
		display: grid;
		gap: var(--space-4);
	}
	label {
		font-weight: 700;
	}
	textarea {
		width: 100%;
		min-height: 60vh;
		resize: vertical;
		padding: var(--space-4);
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container-low);
		color: var(--color-on-background);
		font: 1rem/1.6 var(--font-mono);
		color-scheme: light dark;
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		flex-wrap: wrap;
	}
	.actions p {
		max-width: var(--measure);
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	.actions .dirty-status {
		font-weight: 700;
	}
	button {
		min-height: 3rem;
		padding: 0 var(--space-5);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-sm);
		background: var(--color-primary);
		color: var(--color-on-primary);
		font: 700 1rem/1.4 var(--font-ui);
		cursor: pointer;
	}
	button:hover {
		background: var(--color-on-background);
		border-color: var(--color-on-background);
	}
	@media (max-width: 700px) {
		.document-context,
		.actions {
			align-items: stretch;
			flex-direction: column;
		}
		.document-context > :global(.admin-status) {
			align-self: stretch;
		}
	}
</style>
