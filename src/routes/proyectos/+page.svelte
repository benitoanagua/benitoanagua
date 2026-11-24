<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { getProjects } from '$lib/data/projects-loader';
	import { projectsCopy } from '$lib/data/projects-copy';
	import { uiCopy } from '$lib/data/ui-copy';
	import { PROJECT_AREAS } from '$lib/types/Project';

	const copy = $derived(projectsCopy(lang.current));
	const ui = $derived(uiCopy(lang.current).projects);
	const all = $derived(getProjects());
	const areas = $derived(PROJECT_AREAS.filter((a) => all.some((p) => p.area === a)));

	let area = $state<string>('all');
	const visible = $derived(area === 'all' ? all : all.filter((p) => p.area === area));

	onMount(() => {
		const q = new URLSearchParams(location.search).get('area');
		if (q && (PROJECT_AREAS as string[]).includes(q)) area = q;
	});

	function select(next: string) {
		area = next;
		const base = resolve('/proyectos');
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- el query ?area= no forma parte de la ruta
		replaceState(next === 'all' ? base : `${base}?area=${next}`, {});
	}
</script>

<svelte:head>
	<title>{copy.title} — Benito Anagua</title>
	<meta name="description" content={copy.lead} />
</svelte:head>

<PortalLayout>
	<div class="page">
		<header class="intro">
			<p class="eyebrow kicker">{ui.eyebrow}</p>
			<h1>{copy.title}</h1>
			<p class="lead">{copy.lead}</p>
		</header>

		<section class="listing">
			<div class="chips" role="group" aria-label={copy.filterAria}>
				<button class="chip label" aria-pressed={area === 'all'} onclick={() => select('all')}>
					{copy.filterAll} <span>{all.length}</span>
				</button>
				{#each areas as a (a)}
					<button class="chip label" aria-pressed={area === a} onclick={() => select(a)}>
						{copy.areas[a]} <span>{all.filter((p) => p.area === a).length}</span>
					</button>
				{/each}
			</div>

			<p class="count meta" aria-live="polite">{visible.length} {copy.count}</p>

			{#if visible.length}
				<div class="grid shared-boundary">
					{#each visible as project (project.slug)}
						<ProjectCard
							{project}
							areaLabel={copy.areas[project.area]}
							statusLabel={project.status ? copy.statuses[project.status] : undefined}
						/>
					{/each}
				</div>
			{:else}
				<p class="lead">{copy.empty}</p>
			{/if}
		</section>
	</div>
</PortalLayout>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 3.5rem);
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) var(--space-4) var(--space-20);
	}
	.intro {
		padding: clamp(2rem, 6vw, 4rem);
		background: var(--color-surface-container);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	.eyebrow {
		margin-bottom: var(--space-4);
	}
	.lead {
		max-width: var(--measure);
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
		margin-top: var(--space-6);
	}
	.listing {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}
	.chip {
		min-height: 2.75rem;
		padding: 0 var(--space-4);
		background: transparent;
		color: var(--color-on-surface-variant);
		border: var(--rule-base) solid var(--color-outline);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.chip span {
		font-weight: 400;
		opacity: 0.7;
	}
	.chip:hover {
		color: var(--color-on-background);
		border-color: var(--color-on-background);
	}
	.chip[aria-pressed='true'] {
		background: var(--color-on-background);
		color: var(--color-background);
		border-color: var(--color-on-background);
	}
	.count {
		min-height: 1.2em;
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
	}
</style>
