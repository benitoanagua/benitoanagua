<script lang="ts">
	let {
		label,
		value,
		detail
	}: {
		label: string;
		value: string | number;
		detail?: string;
	} = $props();
</script>

<section class="admin-metric">
	<p class="label">{label}</p>
	<p class="value">{value}</p>
	{#if detail}<p class="detail">{detail}</p>{/if}
</section>

<style>
	.admin-metric {
		min-width: 0;
		padding-block: var(--space-5);
		border-top: var(--rule-base) solid var(--color-on-background);
		border-bottom: var(--rule-base) solid var(--color-rule-subtle);
	}
	.label {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	.value {
		margin: var(--space-3) 0;
		font-family: var(--font-display);
		font-size: var(--text-display);
		line-height: var(--leading-display);
		letter-spacing: var(--tracking-display);
		font-variant-numeric: tabular-nums;
	}
	.detail {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
</style>
