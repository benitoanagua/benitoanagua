<script lang="ts">
	let {
		title,
		description,
		href
	}: {
		title: string;
		description: string;
		href: string;
	} = $props();
</script>

<a class="admin-quick-link" {href}>
	<span class="title">{title}</span>
	<span class="description">{description}</span>
	<span class="action">Abrir sección <span aria-hidden="true">→</span></span>
</a>

<style>
	.admin-quick-link {
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
	.description { color: var(--color-on-surface-variant); }
	.action {
		align-self: end;
		margin-top: var(--space-3);
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}
	.admin-quick-link:hover .title { color: var(--color-primary); }
	.admin-quick-link:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
</style>
