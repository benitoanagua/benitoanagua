<script lang="ts">
	type Tone = 'note' | 'success' | 'warning' | 'error';
	let {
		tone = 'note',
		label,
		children
	}: {
		tone?: Tone;
		label: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<div class="ds-notice" class:success={tone === 'success'} class:warning={tone === 'warning'} class:error={tone === 'error'} role={tone === 'error' ? 'alert' : 'status'}>
	<p class="ds-notice-text">
		<span class="label tone">{label}</span>
		<span class="sep" aria-hidden="true">—</span>
		{@render children?.()}
	</p>
</div>

<style>
	.ds-notice {
		padding: var(--space-4) 0;
		border-top: var(--rule-base) solid var(--color-on-background);
		border-bottom: var(--rule-base) solid var(--color-on-background);
	}
	.ds-notice.error {
		border-top-width: var(--rule-thick);
		border-bottom-width: var(--rule-thick);
	}
	.ds-notice-text {
		margin: 0;
	}
	.tone {
		color: var(--color-primary);
	}
	.success .tone {
		color: var(--color-success);
	}
	.warning .tone {
		color: var(--color-warning);
	}
	.error .tone {
		color: var(--color-error);
	}
	.sep {
		margin: 0 var(--space-2);
		color: var(--color-on-surface-variant);
	}
</style>
