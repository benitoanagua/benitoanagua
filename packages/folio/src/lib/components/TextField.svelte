<script lang="ts">
	let {
		label,
		value = $bindable(''),
		id,
		placeholder = '',
		hint,
		type = 'text',
		error
	}: {
		label: string;
		value?: string;
		id: string;
		placeholder?: string;
		hint?: string;
		type?: string;
		error?: string;
	} = $props();

	const describedBy = $derived(
		[error ? `${id}-error` : hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined
	);
</script>

<div class="ds-field">
	<label class="label" for={id}>{label}</label>
	<input
		class="ds-input"
		class:invalid={!!error}
		{id}
		{type}
		{placeholder}
		bind:value
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={describedBy}
	/>
	{#if error}
		<p class="ds-error label" id="{id}-error">{error}</p>
	{:else if hint}
		<p class="ds-hint" id="{id}-hint">{hint}</p>
	{/if}
</div>

<style>
	.ds-field {
		display: grid;
		gap: var(--space-2);
	}
	.ds-input {
		width: 100%;
		min-height: 3rem;
		padding: 0 var(--space-1);
		border: 0;
		border-bottom: var(--rule-base) solid var(--color-on-background);
		border-radius: 0;
		background: var(--color-background);
		color: var(--color-on-background);
		font: var(--text-body) / var(--leading-body) var(--font-body);
		transition: border-color var(--duration-fast);
	}
	.ds-input.invalid {
		border-bottom: var(--rule-thick) solid var(--color-error);
	}
	.ds-input::placeholder {
		color: var(--color-ink-soft);
	}
	.ds-hint {
		font-size: var(--text-meta);
		color: var(--color-on-surface-variant);
	}
	.ds-error {
		color: var(--color-error);
	}
</style>
