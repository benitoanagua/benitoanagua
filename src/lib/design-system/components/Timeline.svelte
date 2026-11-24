<script lang="ts">
	export interface TimelineEntry {
		period: string;
		title: string;
		organization?: string;
		description?: string;
		href?: string;
	}
	let { items }: { items: TimelineEntry[] } = $props();
</script>

<ol class="ds-timeline">
	{#each items as item}
		<li>
			<div class="period meta">{item.period}</div>
			<div class="entry">
				<h3 class="ds-entry-title">
					{#if item.href}<a href={item.href}>{item.title}</a>{:else}{item.title}{/if}
				</h3>
				{#if item.organization}<p class="organization label">{item.organization}</p>{/if}
				{#if item.description}<p class="description">{item.description}</p>{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
	.ds-timeline {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.ds-timeline li {
		display: grid;
		grid-template-columns: minmax(6rem, 9rem) 1fr;
		gap: var(--space-6);
		padding: 0 0 var(--space-8);
	}
	.period {
		padding-top: var(--space-1);
	}
	.entry {
		position: relative;
		border-left: var(--rule-hair) solid var(--color-outline-variant);
		padding: 0 0 0 var(--space-6);
	}
	.entry::before {
		content: '';
		position: absolute;
		left: calc(-1 * var(--rule-hair) - 5px);
		top: 0.55em;
		width: 10px;
		height: 10px;
		background: var(--color-on-background);
	}
	.ds-entry-title {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: var(--leading-section);
		font-weight: 700;
	}
	.organization {
		margin: var(--space-1) 0 0;
		color: var(--color-on-background);
	}
	.description {
		margin: var(--space-2) 0 0;
		color: var(--color-on-surface-variant);
	}
	@media (max-width: 520px) {
		.ds-timeline li {
			grid-template-columns: 1fr;
			gap: var(--space-2);
		}
		.entry {
			padding-left: var(--space-4);
		}
	}
</style>
