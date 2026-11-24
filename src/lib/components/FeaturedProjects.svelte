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
		<h2 id="featured-title" class="kicker">{copy.featuredTitle}</h2>
		<a class="more label" href="/proyectos">{copy.featuredCta} ↗</a>
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
		gap: var(--space-6);
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-4);
		flex-wrap: wrap;
		padding-bottom: var(--space-4);
		border-bottom: var(--rule-hair) solid var(--color-on-background);
	}
	.more {
		color: var(--color-primary);
		text-decoration: none;
	}
	.more:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 21rem), 1fr));
		border: var(--rule-hair) solid var(--color-outline-variant);
	}
</style>
