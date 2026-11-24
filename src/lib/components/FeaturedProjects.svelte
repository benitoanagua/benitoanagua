<script lang="ts">
	import { resolve } from '$app/paths';
	import ProjectCard from './ProjectCard.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { getFeaturedProjects } from '$lib/data/projects-loader';
	import { projectsCopy } from '$lib/data/projects-copy';

	const copy = $derived(projectsCopy(lang.current));
	const projects = $derived(getFeaturedProjects());
</script>

<section class="featured" aria-labelledby="featured-title">
	<div class="head">
		<h2 id="featured-title" class="kicker">{copy.featuredTitle}</h2>
		<a class="more label" href={resolve('/proyectos')}>
			{copy.featuredCta}
			<span aria-hidden="true">↗</span>
		</a>
	</div>
	<div class="project-list">
		{#each projects as project (project.slug)}
			<ProjectCard
				{project}
				areaLabel={copy.areas[project.area]}
				statusLabel={project.status ? copy.statuses[project.status] : undefined}
			/>
		{/each}
	</div>
</section>

<style>
	.featured {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-4);
		flex-wrap: wrap;
	}
	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-on-surface-variant);
		text-decoration: none;
		transition: color var(--duration-fast);
	}
	.more span {
		color: var(--color-primary);
		transition: transform var(--duration-fast);
	}
	.more:hover { color: var(--color-primary); }
	.more:hover span { transform: translate(2px, -2px); }
	.project-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: clamp(2rem, 5vw, 5rem);
		row-gap: var(--space-editorial-md);
	}
	@media (max-width: 700px) {
		.project-list { grid-template-columns: minmax(0, 1fr); }
	}
</style>
