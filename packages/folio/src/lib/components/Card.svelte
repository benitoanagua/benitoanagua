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
		background: transparent;
		border: 0;
		border-radius: 0;
	}
	.ds-card-title {
		padding: 0 0 var(--space-3);
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: var(--leading-section);
	}
	.ds-card-content {
		padding: 0;
	}
</style>
