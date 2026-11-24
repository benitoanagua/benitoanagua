<script lang="ts">
	type Variant = 'hair' | 'soft' | 'thick' | 'double' | 'space';
	type Orientation = 'horizontal' | 'vertical';
	let {
		orientation = 'horizontal',
		variant = 'soft',
		label
	}: {
		orientation?: Orientation;
		variant?: Variant;
		label?: string;
	} = $props();
</script>

{#if variant === 'space'}
	<div class="ds-divider space" aria-hidden="true"></div>
{:else if label}
	<div class="ds-divider labeled" role="separator">
		<span class="line rule-{variant}"></span>
		<span class="meta">{label}</span>
		<span class="line rule-{variant}"></span>
	</div>
{:else if orientation === 'vertical'}
	<div class="ds-divider vertical" role="separator" aria-orientation="vertical"></div>
{:else}
	<div class="ds-divider rule-{variant}" role="separator"></div>
{/if}

<style>
	.ds-divider {
		border: 0;
	}
	.space {
		height: var(--space-editorial-md);
	}
	.rule-hair,
	.rule-soft {
		border-top: var(--rule-hair) solid var(--color-rule-subtle);
	}
	.rule-thick,
	.rule-double {
		border-top: var(--rule-hair) solid var(--color-outline-variant);
	}
	.labeled {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		height: auto;
		background: none;
	}
	.labeled .line {
		flex: 1;
		height: 0;
	}
	.labeled .meta {
		flex: none;
	}
	.vertical {
		width: var(--rule-hair);
		height: auto;
		min-height: 1rem;
		align-self: stretch;
		background: var(--color-rule-subtle);
	}
</style>
