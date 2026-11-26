<script lang="ts">
	let {
		eyebrow,
		title,
		description,
		level = 1
	}: {
		eyebrow?: string;
		title: string;
		description?: string;
		level?: 1 | 2 | 3;
	} = $props();
</script>

<header class="ds-page-header">
	{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
	{#if level === 1}
		<h1>{title}</h1>
	{:else if level === 2}
		<h2>{title}</h2>
	{:else}
		<h3>{title}</h3>
	{/if}
	{#if description}<p class="description">{description}</p>{/if}
</header>

<style>
	.ds-page-header {
		display: grid;
		gap: var(--space-4);
		margin-bottom: var(--space-editorial-md);
		color: var(--color-on-background);
	}
	.eyebrow {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	.ds-page-header h1,
	.ds-page-header h2,
	.ds-page-header h3 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: var(--tracking-display);
	}
	.ds-page-header h1 {
		font-size: var(--text-title);
		line-height: var(--leading-title);
	}
	.ds-page-header h2 {
		font-size: var(--text-section);
		line-height: var(--leading-section);
	}
	.ds-page-header h3 {
		font-size: var(--text-title);
		line-height: var(--leading-title);
	}
	.description {
		max-width: var(--measure);
		margin: 0;
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
	}
</style>
