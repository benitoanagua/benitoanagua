<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { getProjects } from '$lib/data/projects-loader';
	import { projectsCopy } from '$lib/data/projects-copy';
	import { PROJECT_AREAS } from '$lib/types/Project';

	const copy = $derived(projectsCopy(lang.current));
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
		replaceState(next === 'all' ? location.pathname : `?area=${next}`, {});
	}
</script>

<svelte:head>
	<title>{copy.title} — Benito Anagua</title>
	<meta name="description" content={copy.lead} />
</svelte:head>

<PortalLayout>
	<div class="page">
		<header>
			<p class="eyebrow mono">PROJECTS / SELECTED WORK</p>
			<h1>{copy.title}</h1>
			<p class="lead">{copy.lead}</p>
		</header>

		<section class="listing">
			<div class="chips" role="group" aria-label={copy.filterAria}>
				<button class="chip mono" aria-pressed={area === 'all'} onclick={() => select('all')}>
					{copy.filterAll} <span>{all.length}</span>
				</button>
				{#each areas as a}
					<button class="chip mono" aria-pressed={area === a} onclick={() => select(a)}>
						{copy.areas[a]} <span>{all.filter((p) => p.area === a).length}</span>
					</button>
				{/each}
			</div>

			<p class="count mono" aria-live="polite">{visible.length} {copy.count}</p>

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
	header {
		padding: clamp(2rem, 6vw, 4rem);
		background: var(--color-surface);
		border: 1px solid var(--color-outline-variant);
	}
	.eyebrow {
		font-size: 0.65rem;
		letter-spacing: 0.14em;
		color: var(--color-primary);
		margin-bottom: 1.25rem;
	}
	h1 {
		font-size: clamp(2.3rem, 6vw, 4.5rem);
		line-height: 1.04;
		letter-spacing: -0.045em;
		text-transform: none;
	}
	.lead {
		max-width: 62ch;
		color: var(--color-on-surface-variant);
		line-height: 1.75;
		margin-top: 1.25rem;
	}
	.listing {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.chip {
		font-size: 0.72rem;
		font-weight: 700;
		padding: 0.5rem 0.9rem;
		background: transparent;
		color: var(--color-on-surface-variant);
		border: 1px solid var(--color-outline-variant);
	}
	.chip span {
		opacity: 0.6;
		font-weight: 400;
	}
	.chip:hover {
		color: var(--color-on-surface);
		border-color: var(--color-outline);
	}
	.chip[aria-pressed='true'] {
		background: var(--color-on-surface);
		color: var(--color-surface);
		border-color: var(--color-on-surface);
	}
	.count {
		font-size: 0.72rem;
		color: var(--color-on-surface-variant);
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		border: 1px solid var(--color-outline-variant);
	}
</style>
