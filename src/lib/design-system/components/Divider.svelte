<script lang="ts">
	type Variant = 'hair' | 'soft' | 'thick' | 'double';
	type Orientation = 'horizontal' | 'vertical';
	let {
		orientation = 'horizontal',
		variant = 'hair',
		label
	}: {
		orientation?: Orientation;
		variant?: Variant;
		label?: string;
	} = $props();
</script>

{#if label}
	<div class="ds-divider labeled" role="separator">
		<span class="line rule-{variant}"></span>
		<span class="meta">{label}</span>
		<span class="line rule-{variant}"></span>
	</div>
{:else if orientation === 'vertical'}
	<div
		class="ds-divider vertical"
		role="separator"
		aria-orientation="vertical"
	></div>
{:else}
	<div class="ds-divider rule-{variant}" role="separator"></div>
{/if}

<style>
	.ds-divider {
		border: 0;
	}
	.rule-hair {
		border-top: var(--rule-hair) solid var(--color-on-background);
	}
	.rule-soft {
		border-top: var(--rule-hair) dashed var(--color-outline-variant);
	}
	.rule-thick {
		border-top: var(--rule-thick) solid var(--color-on-background);
	}
	.rule-double {
		height: 7px;
		background: var(--rule-double);
		border-top: 0;
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
		background: var(--color-outline-variant);
	}
</style>
