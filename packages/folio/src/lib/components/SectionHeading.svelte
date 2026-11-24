<script lang="ts">
	let {
		eyebrow,
		title,
		description,
		align = 'left',
		level = 2,
		rule = true
	}: {
		eyebrow?: string;
		title: string;
		description?: string;
		align?: 'left' | 'center';
		level?: 2 | 3;
		rule?: boolean;
	} = $props();
</script>

<header class="ds-section-heading" class:center={align === 'center'}>
	{#if rule}<div class="ds-rule rule-thick"></div>{/if}
	{#if eyebrow}<p class="kicker">{eyebrow}</p>{/if}
	{#if level === 2}
		<h2 class="ds-title level-2">{title}</h2>
	{:else}
		<h3 class="ds-title level-3">{title}</h3>
	{/if}
	{#if description}<p class="ds-description">{description}</p>{/if}
</header>

<style>
	.ds-section-heading {
		max-width: 48rem;
		margin-bottom: var(--space-8);
		color: var(--color-on-background);
	}
	.center {
		text-align: center;
		margin-inline: auto;
	}
	.ds-rule {
		margin-bottom: var(--space-6);
	}
	.center .ds-rule {
		margin-inline: auto;
	}
	.kicker {
		margin-bottom: var(--space-4);
	}
	.ds-title {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
	}
	.level-2 {
		font-size: var(--text-section);
		line-height: var(--leading-section);
	}
	.level-3 {
		font-size: var(--text-title);
		line-height: var(--leading-title);
		letter-spacing: -0.015em;
	}
	.ds-description {
		max-width: var(--measure);
		margin: var(--space-4) 0 0;
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
	}
	.center .ds-description {
		margin-inline: auto;
	}
</style>
