<script lang="ts">
	type Tone = 'neutral' | 'success' | 'warning' | 'error';
	let {
		label,
		detail,
		tone = 'neutral'
	}: {
		label: string;
		detail?: string;
		tone?: Tone;
	} = $props();
</script>

<p class="admin-status" class:success={tone === 'success'} class:warning={tone === 'warning'} class:error={tone === 'error'} role={tone === 'error' ? 'alert' : 'status'}>
	<strong>{label}</strong>
	{#if detail}<span>{detail}</span>{/if}
</p>

<style>
	.admin-status {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2) var(--space-3);
		margin: 0;
		padding: var(--space-3) 0;
		border-block: var(--rule-base) solid var(--color-rule-subtle);
		font-size: var(--text-meta);
	}
	.admin-status strong {
		font-weight: 700;
	}
	.admin-status span {
		color: var(--color-on-surface-variant);
	}
	.success strong { color: var(--color-success); }
	.warning strong { color: var(--color-warning); }
	.error {
		border-block-width: var(--rule-thick);
		border-color: var(--color-error);
	}
	.error strong { color: var(--color-error); }
</style>
