<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { getProjectsForSkill } from '$lib/data/projects-loader';
	import { projectsCopy } from '$lib/data/projects-copy';

	let { slug }: { slug: string } = $props();

	const copy = $derived(projectsCopy(lang.current));
	const projects = $derived(getProjectsForSkill(slug));
</script>

{#if projects.length}
	<section class="skill-projects" aria-labelledby="skill-projects-title">
		<h2 id="skill-projects-title">{copy.skillProjectsTitle}</h2>
		<p class="lead">{copy.skillProjectsLead}</p>
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
{/if}

<style>
	.skill-projects {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	h2 {
		font-size: 1.4rem;
		text-transform: none;
	}
	.lead {
		color: var(--color-on-surface-variant);
		font-size: 0.9rem;
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
		border: 1px solid var(--color-outline-variant);
	}
</style>
