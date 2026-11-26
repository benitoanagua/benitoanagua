<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const selectionKey = $derived(`${data.selection.key}:${data.selection.locale}`);
	let edits = $state<Record<string, string>>({});
	const content = $derived(edits[selectionKey] ?? data.contentJson);
	function documentHref(key: string, locale: string) {
		return `${resolve('/admin')}?key=${key}&locale=${locale}`;
	}
</script>

<svelte:head>
	<title>Portfolio CMS — Admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="admin">
	<header class="heading">
		<p class="eyebrow">PORTFOLIO CMS</p>
		<h1>Content editor</h1>
		<p class="lead">Edición autenticada de documentos localizados en Cloudflare D1.</p>
	</header>

	<nav class="documents" aria-label="Admin sections">
		<a href={resolve('/admin/proyectos')}>Projects CMS ↗</a>
	</nav>

	<!-- eslint-disable svelte/no-navigation-without-resolve -- los enlaces llevan query ?key&locale que resolve() no expresa -->
	<nav class="documents" aria-label="Content documents">
		{#each ['site', 'cv', 'skill_stories'] as key (key)}
			{#each ['es', 'en'] as locale (locale)}
				<a
					class:active={data.selection.key === key && data.selection.locale === locale}
					href={documentHref(key, locale)}>{key} · {locale.toUpperCase()}</a
				>
			{/each}
		{/each}
	</nav>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->

	<section class="editor">
		<div class="editor-meta">
			<div>
				<h2>{data.selection.key} / {data.selection.locale}</h2>
				<p>Última actualización: {data.updatedAt ?? '—'}</p>
			</div>
			<span class="status">D1 · LIVE</span>
		</div>

		{#if form?.message}
			<p class:success={form.success} class:error={!form.success} role="status">{form.message}</p>
		{/if}

		<form method="POST" action="?/save" use:enhance>
			<input type="hidden" name="key" value={data.selection.key} />
			<input type="hidden" name="locale" value={data.selection.locale} />
			<label for="content">Documento JSON</label>
			<textarea
				id="content"
				name="content"
				value={content}
				oninput={(event) => (edits[selectionKey] = event.currentTarget.value)}
				spellcheck="false"
				required
			></textarea>
			<div class="actions">
				<p>El contenido se guarda directamente en D1. Revisa el JSON antes de guardar.</p>
				<button type="submit">Guardar cambios</button>
			</div>
		</form>
	</section>
</main>

<style>
	.admin {
		max-width: 76rem;
		margin: 0 auto;
		padding: clamp(1.25rem, 4vw, 3rem) 1rem 5rem;
		display: grid;
		gap: 2rem;
	}
	.heading {
		display: grid;
		gap: 0.75rem;
	}
	.eyebrow {
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		font-weight: 700;
		color: var(--color-primary);
	}
	h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1.05;
	}
	.lead {
		color: var(--color-on-surface-variant);
		max-width: 42rem;
	}
	.documents {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.documents a {
		border: 1px solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		padding: 0.65rem 0.85rem;
		text-decoration: none;
		color: var(--color-on-surface-variant);
		font-size: 0.875rem;
	}
	.documents a.active {
		background: var(--color-on-background);
		color: var(--color-background);
		border-color: var(--color-on-background);
	}
	.editor {
		border: 1px solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		padding: clamp(1rem, 3vw, 2rem);
		display: grid;
		gap: 1.5rem;
	}
	.editor-meta {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}
	.editor-meta h2 {
		font-size: 1.25rem;
	}
	.editor-meta p,
	.actions p {
		color: var(--color-on-surface-variant);
		font-size: 0.875rem;
	}
	.status {
		font-size: 0.75rem;
		font-weight: 700;
		border: 1px solid var(--color-outline);
		padding: 0.35rem 0.5rem;
		white-space: nowrap;
	}
	form {
		display: grid;
		gap: 0.75rem;
	}
	label {
		font-weight: 700;
	}
	textarea {
		width: 100%;
		min-height: 60vh;
		resize: vertical;
		padding: 1rem;
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container);
		color: var(--color-on-background);
		font:
			400 0.875rem/1.6 ui-monospace,
			SFMono-Regular,
			Consolas,
			monospace;
	}
	.actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.actions p {
		max-width: 38rem;
	}
	button {
		min-height: 2.75rem;
		padding: 0 1.25rem;
		border: 0;
		border-radius: var(--radius-sm);
		background: var(--color-on-background);
		color: var(--color-background);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.success {
		color: #287a42;
	}
	.error {
		color: #b42318;
	}
	@media (max-width: 40rem) {
		.editor-meta,
		.actions {
			align-items: stretch;
			flex-direction: column;
		}
	}
</style>
