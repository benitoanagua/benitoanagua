<script lang="ts">
	let {
		cite,
		children
	}: {
		cite?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<blockquote class="ds-pullquote">
	<p class="ds-pullquote-text">{@render children?.()}</p>
	{#if cite}<cite class="meta">{cite}</cite>{/if}
</blockquote>

<style>
	.ds-pullquote {
		max-width: 52ch;
		margin: 0;
		padding: var(--space-6) 0 0;
		border-top: var(--rule-thick) solid var(--color-primary);
	}
	.ds-pullquote-text {
		margin: 0;
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem);
		line-height: 1.4;
		color: var(--color-on-background);
	}
	cite {
		display: block;
		margin-top: var(--space-4);
		font-style: normal;
	}
</style>
