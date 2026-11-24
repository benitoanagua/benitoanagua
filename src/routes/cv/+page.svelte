<script lang="ts">
	import { resolve } from '$app/paths';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { uiCopy } from '$lib/data/ui-copy';

	let { data } = $props();

	const files = $derived(data.documents[lang.current] ?? data.documents.es);

	const copy = $derived(uiCopy(lang.current).cv);
</script>

<svelte:head>
	<title>{copy.title} — Benito Anagua</title>
	<meta name="description" content={copy.intro} />
</svelte:head>

<PortalLayout>
	<div class="cv-page">
		<header class="intro">
			<p class="eyebrow kicker">{copy.eyebrow}</p>
			<h1>{copy.title}</h1>
			<p class="lead">{copy.intro}</p>
			<a class="primary label" href={resolve('/habilidades')}>{copy.explore} ↗</a>
		</header>
		<section class="documents-section">
			<h2 class="section-title">{copy.current}</h2>
			{#if copy.languageNote}
				<p class="note">
					{#if copy.languageNoteLabel}<span class="meta"
							>{copy.languageNoteLabel} —
						</span>{/if}{copy.languageNote}
				</p>
			{/if}
			<div class="documents">
				{#each files as file (file.key)}
					<a class="document" href={file.publicPath} download rel="external">
						<span class="meta doc-format">PDF · ES · 2026</span>
						<h3>{file.label}</h3>
						<span class="download label">{copy.download} ↓</span>
					</a>
				{/each}
			</div>
		</section>
	</div>
</PortalLayout>

<style>
	.cv-page {
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 3.5rem);
		max-width: var(--container-lg);
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) var(--space-4) var(--space-20);
	}
	.intro {
		padding: clamp(2rem, 6vw, 5rem);
		background: var(--color-surface-container);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	.eyebrow {
		margin-bottom: var(--space-4);
	}
	h1 {
		font-size: clamp(2.3rem, 6vw, 4.5rem);
		line-height: var(--leading-tight);
	}
	.lead {
		max-width: var(--measure);
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
		margin-top: var(--space-6);
	}
	.primary {
		display: inline-flex;
		align-items: center;
		min-height: 3rem;
		margin-top: var(--space-8);
		padding: 0 var(--space-6);
		background: var(--color-on-background);
		color: var(--color-background);
		border-radius: var(--radius-sm);
		text-decoration: none;
	}
	.primary:hover {
		background: var(--color-primary);
	}
	.documents-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.section-title {
		font-size: var(--text-section);
	}
	.note {
		color: var(--color-on-surface-variant);
		font-size: var(--text-meta);
		line-height: var(--leading-body);
		max-width: var(--measure);
	}
	.documents {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
	}
	.document {
		display: flex;
		flex-direction: column;
		padding: var(--space-6);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container);
		text-decoration: none;
		color: inherit;
		transition: border-color var(--duration-fast);
	}
	.document:hover {
		border-color: var(--color-on-background);
	}
	.doc-format {
		display: block;
		margin-bottom: var(--space-3);
	}
	.document h3 {
		font-size: 1.25rem;
		text-transform: none;
	}
	.download {
		color: var(--color-primary);
		margin-top: auto;
		padding-top: var(--space-6);
	}
	@media (max-width: 600px) {
		.documents {
			grid-template-columns: 1fr;
		}
	}
</style>
