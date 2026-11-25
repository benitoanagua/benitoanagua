<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';
	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		onclick,
		children
	}: {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		loading?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<button
	class="ds-button label"
	class:secondary={variant === 'secondary'}
	class:outline={variant === 'outline'}
	class:ghost={variant === 'ghost'}
	class:sm={size === 'sm'}
	class:lg={size === 'lg'}
	disabled={disabled || loading}
	aria-busy={loading}
	{onclick}
>
	{#if loading}
		<svg class="spinner" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4">
				<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite" />
			</circle>
		</svg>
		<span class="ds-visually-hidden">Cargando</span>
	{/if}
	{@render children?.()}
</button>

<style>
	.ds-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-height: 3rem;
		padding: 0 var(--space-5);
		border: 0;
		border-radius: var(--radius-sm);
		background: var(--color-primary);
		color: var(--color-on-primary);
		text-decoration: none;
		transition:
			background-color var(--duration-fast),
			color var(--duration-fast);
	}
	.ds-button:hover:not(:disabled) {
		background: var(--color-on-background);
	}
	.secondary,
	.outline {
		background: transparent;
		color: var(--color-on-background);
	}
	.outline {
		border: 1px solid var(--color-outline);
	}
	.secondary:hover:not(:disabled),
	.outline:hover:not(:disabled) {
		background: var(--color-surface-container-low);
		color: var(--color-primary);
	}
	.outline:hover:not(:disabled) {
		border-color: var(--color-primary);
	}
	.ghost {
		background: transparent;
		color: var(--color-on-background);
	}
	.ghost:hover:not(:disabled) {
		background: transparent;
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.ds-button:disabled {
		color: var(--color-ink-soft);
		background: var(--color-surface-container);
		cursor: not-allowed;
	}
	.sm {
		min-height: 2.75rem;
		padding: 0 var(--space-3);
	}
	.lg {
		min-height: 3.5rem;
		padding: 0 var(--space-8);
	}
	.spinner {
		width: 1em;
		height: 1em;
		flex-shrink: 0;
		animation: ds-spin 0.75s linear infinite;
	}
	.spinner circle {
		transform-origin: center;
		animation: ds-spin-dash 1.5s ease-in-out infinite;
	}
	@keyframes ds-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes ds-spin-dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -124;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.spinner,
		.spinner circle {
			animation: none;
		}
		.spinner circle {
			stroke-dasharray: 31.4 31.4;
			stroke-dashoffset: 0;
		}
	}
</style>
