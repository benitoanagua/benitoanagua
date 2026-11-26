<script lang="ts">
	let {
		title,
		description,
		href,
		actionLabel = 'Explore section'
	}: {
		title: string;
		description: string;
		href: string;
		actionLabel?: string;
	} = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<a class="ds-action-link" {href}>
	<span class="title">{title}</span>
	<span class="description">{description}</span>
	<span class="action">{actionLabel} <span aria-hidden="true">→</span></span>
</a>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
	.ds-action-link {
		display: grid;
		align-content: start;
		gap: var(--space-3);
		min-height: 10rem;
		padding-block: var(--space-5);
		border-top: var(--rule-base) solid var(--color-on-background);
		border-bottom: var(--rule-base) solid var(--color-rule-subtle);
		color: var(--color-on-background);
		text-decoration: none;
	}
	.title {
		font-family: var(--font-display);
		font-size: var(--text-section);
		font-weight: 700;
		line-height: var(--leading-section);
	}
	.description {
		color: var(--color-on-surface-variant);
	}
	.action {
		align-self: end;
		margin-top: var(--space-3);
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}
	.ds-action-link:hover .title {
		color: var(--color-primary);
	}
	.ds-action-link:focus-visible {
		outline: var(--focus-ring);
		outline-offset: var(--focus-offset);
	}
</style>
