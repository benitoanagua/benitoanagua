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
		padding: 0.3rem 0.6rem;
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		color: var(--color-on-surface-variant);
	}
	.success {
		color: var(--color-success);
		border-color: var(--color-success);
	}
	.warning {
		color: var(--color-warning);
		border-color: var(--color-warning);
	}
	.danger {
		color: var(--color-error);
		border-color: var(--color-error);
	}
</style>
