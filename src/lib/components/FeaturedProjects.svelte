<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { getFeaturedProjects } from '$lib/data/projects-loader';
	import { projectsCopy } from '$lib/data/projects-copy';

	const copy = $derived(projectsCopy(lang.current));
	const projects = $derived(getFeaturedProjects());
</script>

<section class="featured" aria-labelledby="featured-title">
	<div class="head">
		<h2 id="featured-title" class="mono">{copy.featuredTitle}</h2>
		<a class="more mono" href="/proyectos">{copy.featuredCta}</a>
	</div>
	<div class="grid shared-boundary">
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
		gap: 1.25rem;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		flex-wrap: wrap;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid var(--color-outline-variant);
	}
	h2 {
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-primary);
	}
	.more {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-primary);
		text-decoration: none;
		border-bottom: 1px solid currentColor;
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 21rem), 1fr));
		border: 1px solid var(--color-outline-variant);
	}
</style>
