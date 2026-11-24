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
		<h2 id="skill-projects-title" class="kicker">{copy.skillProjectsTitle}</h2>
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
		gap: var(--space-4);
	}
	.lead {
		max-width: var(--measure);
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
		border: var(--rule-hair) solid var(--color-outline-variant);
	}
</style>
