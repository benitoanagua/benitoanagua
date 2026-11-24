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
		<div class="top mono">
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
					<li class="mono">{item}</li>
				{/each}
			</ul>
		{/if}
		{#if statusLabel}<span class="status mono">{statusLabel}</span>{/if}
	</div>
</article>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		min-height: 15rem;
		padding: 1.5rem;
		background: var(--color-surface);
	}
	.card-link {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		color: inherit;
		text-decoration: none;
	}
	/* Toda la tarjeta es clicable sin anidar enlaces */
	.card-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.card-link:focus-visible {
		box-shadow: none;
	}
	.card:has(.card-link:focus-visible) {
		box-shadow: inset var(--ring-primary);
	}
	.card:hover h3 {
		color: var(--color-primary);
	}
	.top {
		display: flex;
		justify-content: space-between;
		font-size: 0.68rem;
		color: var(--color-on-surface-variant);
	}
	.area {
		color: var(--color-primary);
		font-weight: 700;
	}
	h3 {
		font-size: 1.1rem;
		line-height: 1.25;
		letter-spacing: 0;
		text-transform: none;
	}
	p {
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--color-on-surface-variant);
	}
	.bottom {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		list-style: none;
	}
	.tags li {
		font-size: 0.65rem;
		padding: 0.15rem 0.45rem;
		border: 1px solid var(--color-outline-variant);
		color: var(--color-on-surface-variant);
	}
	.status {
		font-size: 0.65rem;
		color: var(--color-on-surface-variant);
	}
</style>
