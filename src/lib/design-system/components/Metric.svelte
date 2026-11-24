<script lang="ts">
	let {
		value,
		label,
		note
	}: {
		value: string;
		label: string;
		note?: string;
	} = $props();
</script>

<div class="ds-metric">
	<p class="value">{value}</p>
	<p class="label">{label}</p>
	{#if note}<p class="note">{note}</p>{/if}
</div>

<style>
	.ds-metric {
		color: var(--color-on-background);
	}
	.value {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-title);
		line-height: var(--leading-title);
		letter-spacing: var(--tracking-display);
		font-variant-numeric: lining-nums tabular-nums;
	}
	.label {
		margin: var(--space-2) 0 0;
	}
	.note {
		margin: var(--space-1) 0 0;
		font-size: var(--text-meta);
		color: var(--color-on-surface-variant);
	}
</style>
