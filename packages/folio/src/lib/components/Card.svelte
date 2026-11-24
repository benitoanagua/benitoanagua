<script lang="ts">
	let {
		title,
		children
	}: {
		title?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<section class="ds-card">
	{#if title}<header class="ds-card-title">{title}</header>{/if}
	<div class="ds-card-content">{@render children?.()}</div>
</section>

<style>
	.ds-card {
		background: var(--color-surface-container);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	.ds-card-title {
		padding: var(--space-6) var(--space-6) 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: var(--leading-section);
	}
	.ds-card-content {
		padding: var(--space-6);
	}
</style>
