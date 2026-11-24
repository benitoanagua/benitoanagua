<script lang="ts">
	import type { Project } from '$lib/types/Project';

	interface Props {
		project: Project;
		areaLabel: string;
		statusLabel?: string;
	}

	let { project, areaLabel, statusLabel }: Props = $props();
</script>

<article class="card">
	<a class="card-link" href={`/proyectos/${project.slug}`}>
		<div class="top meta">
			<span class="area">{areaLabel}</span>
			<span>{project.year}</span>
		</div>
		<h3>{project.title}</h3>
		<p>{project.summary}</p>
	</a>
	<div class="bottom">
		{#if project.stack.length}
			<ul class="tags">
				{#each project.stack.slice(0, 4) as item}
					<li class="tag meta">{item}</li>
				{/each}
			</ul>
		{/if}
		{#if statusLabel}<span class="status meta">{statusLabel}</span>{/if}
	</div>
</article>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-4);
		min-height: 15rem;
		padding: var(--space-6);
		background: var(--color-surface);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	.card:hover {
		border-color: var(--color-on-background);
	}
	.card:has(.card-link:focus-visible) {
		outline: var(--focus-ring);
		outline-offset: var(--focus-offset);
	}
	.card-link {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		color: inherit;
		text-decoration: none;
	}
	/* Toda la tarjeta es clicable sin anidar enlaces */
	.card-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.top {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
	}
	h3 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: var(--leading-section);
		font-weight: 700;
		letter-spacing: 0;
		text-transform: none;
	}
	.card:hover h3 {
		color: var(--color-primary);
	}
	p {
		font-size: var(--text-meta);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
	}
	.bottom {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		list-style: none;
	}
	.tag {
		padding: 0.2rem 0.5rem;
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	.status {
		color: var(--color-on-surface-variant);
	}
</style>
