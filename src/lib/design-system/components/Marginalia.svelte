<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		aside,
		children
	}: {
		aside: Snippet;
		children: Snippet;
	} = $props();
</script>

<div class="ds-marginalia">
	<aside class="ds-marginalia-aside">{@render aside()}</aside>
	<div class="ds-marginalia-body">{@render children()}</div>
</div>

<style>
	.ds-marginalia {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	:global(.ds-marginalia-aside > *) {
		padding-block: var(--space-3);
	}
	:global(.ds-marginalia-aside > * + *) {
		border-top: var(--rule-hair) dashed var(--color-outline-variant);
	}
	:global(.ds-marginalia-aside > *:first-child) {
		border-top: var(--rule-hair) solid var(--color-on-background);
	}
	@media (min-width: 768px) {
		.ds-marginalia {
			grid-template-columns: var(--margin-col) 1fr;
			gap: var(--margin-gap);
			align-items: start;
		}
	}
	@media (max-width: 767px) {
		.ds-marginalia-aside {
			display: flex;
			flex-wrap: wrap;
			column-gap: var(--space-8);
			row-gap: var(--space-3);
			padding-bottom: var(--space-4);
			margin-bottom: var(--space-2);
			border-bottom: var(--rule-hair) dashed var(--color-outline-variant);
		}
		:global(.ds-marginalia-aside > *) {
			padding-block: 0;
			border-top: 0;
		}
		:global(.ds-marginalia-aside > * + *) {
			border-left: var(--rule-hair) dashed var(--color-outline-variant);
			padding-left: var(--space-8);
		}
		:global(.ds-marginalia-aside > *:first-child) {
			border-top: 0;
		}
	}
</style>
