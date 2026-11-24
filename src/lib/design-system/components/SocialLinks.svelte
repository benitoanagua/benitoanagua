<script lang="ts">
	export interface SocialLink {
		label: string;
		href: string;
	}
	let {
		items,
		compact = false,
		label = 'Social and professional links'
	}: {
		items: SocialLink[];
		compact?: boolean;
		label?: string;
	} = $props();
</script>

<nav class="ds-social" class:compact aria-label={label}>
	{#each items as item}
		<a href={item.href} target="_blank" rel="noreferrer">
			{item.label}<span class="arrow" aria-hidden="true">↗</span>
		</a>
	{/each}
</nav>

<style>
	.ds-social {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3) var(--space-6);
	}
	.ds-social a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--color-on-background);
	}
	.arrow {
		color: var(--color-on-surface-variant);
	}
	.compact {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		gap: 0;
	}
	.compact a {
		display: flex;
		padding: var(--space-2) 0;
	}
	.compact a + a {
		border-top: var(--rule-hair) dashed var(--color-outline-variant);
	}
</style>
