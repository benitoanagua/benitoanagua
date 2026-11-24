<script lang="ts">
	let {
		tone = 'neutral',
		children
	}: {
		tone?: 'neutral' | 'success' | 'warning' | 'danger';
		children?: import('svelte').Snippet;
	} = $props();
</script>

<span
	class="ds-badge label"
	class:success={tone === 'success'}
	class:warning={tone === 'warning'}
	class:danger={tone === 'danger'}
>
	{@render children?.()}
</span>

<style>
	.ds-badge {
		display: inline-flex;
		align-items: center;
		padding: 0;
		color: var(--color-on-surface-variant);
		letter-spacing: var(--tracking-label);
	}
	.ds-badge::before {
		content: '·';
		margin-right: 0.45em;
		color: currentColor;
	}
	.success {
		color: var(--color-success);
	}
	.warning {
		color: var(--color-warning);
	}
	.danger {
		color: var(--color-error);
	}
</style>
