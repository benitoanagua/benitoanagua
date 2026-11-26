<script lang="ts">
	let {
		kicker = 'PORTFOLIO CMS',
		title,
		description
	}: {
		kicker?: string;
		title: string;
		description?: string;
	} = $props();
</script>

<header class="admin-page-header">
	<p class="kicker">{kicker}</p>
	<h1>{title}</h1>
	{#if description}<p class="description">{description}</p>{/if}
</header>

<style>
	.admin-page-header {
		display: grid;
		gap: var(--space-4);
		margin-bottom: var(--space-editorial-md);
	}
	.admin-page-header h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-title);
		font-weight: 700;
		letter-spacing: var(--tracking-display);
		line-height: var(--leading-title);
	}
	.description {
		max-width: var(--measure);
		margin: 0;
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
	}
</style>
