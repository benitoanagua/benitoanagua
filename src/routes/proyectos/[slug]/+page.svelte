<script lang="ts">
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { getProject, getProjects, hasSkillPage } from '$lib/data/projects-loader';
	import { projectsCopy } from '$lib/data/projects-copy';
	import { uiCopy } from '$lib/data/ui-copy';
	import { slugify } from '$lib/utils/slug';

	let { data }: { data: { slug: string } } = $props();

	const copy = $derived(projectsCopy(lang.current));
	const ui = $derived(uiCopy(lang.current).projects);
	const project = $derived(getProject(data.slug));
	const related = $derived(
		getProjects()
			.filter((p) => p.area === project?.area && p.slug !== data.slug)
			.slice(0, 3)
	);
	const links = $derived(
		project
			? [
					{ href: project.links?.repo, label: copy.repo },
					{ href: project.links?.demo, label: copy.demo },
					{ href: project.links?.case, label: copy.case }
				].filter((l) => l.href)
			: []
	);
</script>

<svelte:head>
	{#if project}
		<title>{project.title} — Benito Anagua</title>
		<meta name="description" content={project.summary} />
	{/if}
</svelte:head>

<PortalLayout>
	{#if project}
		<article class="detail">
			<a class="back mono" href="/proyectos">← {copy.back}</a>

			<header>
				<p class="eyebrow mono">{copy.areas[project.area]} / {ui.detailEyebrow}</p>
				<h1>{project.title}</h1>
				<p class="lead">{project.summary}</p>
				<dl class="meta mono">
					<div><dt>{copy.role}</dt><dd>{project.role}</dd></div>
					<div><dt>{copy.year}</dt><dd>{project.year}</dd></div>
					{#if project.status}
						<div><dt>{copy.status}</dt><dd>{copy.statuses[project.status]}</dd></div>
					{/if}
				</dl>
			</header>

			{#if project.context}
				<section>
					<h2>{copy.context}</h2>
					<p class="prose">{project.context}</p>
				</section>
			{/if}

			<section>
				<h2>{copy.highlights}</h2>
				<ul class="bullets">
					{#each project.highlights as item}
						<li>{item}</li>
					{/each}
				</ul>
			</section>

			{#if project.result}
				<section>
					<h2>{copy.result}</h2>
					<p class="prose">{project.result}</p>
				</section>
			{/if}

			{#if project.stack.length}
				<section>
					<h2>{copy.stack}</h2>
					<ul class="tags">
						{#each project.stack as item}
							<li class="mono">{item}</li>
						{/each}
					</ul>
				</section>
			{/if}

			<section>
				<h2>{copy.skills}</h2>
				<ul class="tags">
					{#each project.skills as skill}
						<li class="mono">
							{#if hasSkillPage(skill)}
								<a href={`/habilidades/${slugify(skill)}`}>{skill}</a>
							{:else}
								{skill}
							{/if}
						</li>
					{/each}
				</ul>
			</section>

			{#if links.length}
				<section>
					<h2>{copy.links}</h2>
					<div class="actions">
						{#each links as l}
							<a class="btn mono" href={l.href} rel="noopener">{l.label}</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if related.length}
				<section>
					<h2>{copy.related}</h2>
					<div class="grid shared-boundary">
						{#each related as p (p.slug)}
							<ProjectCard
								project={p}
								areaLabel={copy.areas[p.area]}
								statusLabel={p.status ? copy.statuses[p.status] : undefined}
							/>
						{/each}
					</div>
				</section>
			{/if}
		</article>
	{/if}
</PortalLayout>

<style>
	.detail {
		max-width: 1000px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: clamp(1.5rem, 4vw, 3rem) var(--space-4) var(--space-20);
	}
	.back {
		font-size: 0.75rem;
		color: var(--color-primary);
		text-decoration: none;
	}
	header {
		padding: clamp(2rem, 6vw, 4rem);
		border: 1px solid var(--color-outline-variant);
		background: var(--color-surface);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.eyebrow {
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		color: var(--color-primary);
	}
	h1 {
		font-size: clamp(1.8rem, 4.5vw, 3.2rem);
		line-height: 1.08;
		letter-spacing: -0.03em;
		text-transform: none;
	}
	.lead {
		max-width: 62ch;
		line-height: 1.75;
		color: var(--color-on-surface-variant);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 2rem;
		font-size: 0.75rem;
	}
	.meta dt {
		color: var(--color-on-surface-variant);
	}
	.meta dd {
		font-weight: 700;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	h2 {
		font-size: 1.25rem;
		text-transform: none;
		padding-bottom: 0.6rem;
		border-bottom: 1px solid var(--color-outline-variant);
	}
	.prose {
		max-width: 64ch;
		line-height: 1.75;
	}
	.bullets {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		list-style: none;
		max-width: 66ch;
	}
	.bullets li {
		position: relative;
		padding-left: 1.5rem;
		line-height: 1.65;
	}
	.bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.8em;
		width: 10px;
		height: 1px;
		background: var(--color-primary);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		list-style: none;
	}
	.tags li {
		font-size: 0.75rem;
		padding: 0.2rem 0.55rem;
		border: 1px solid var(--color-outline-variant);
		color: var(--color-on-surface-variant);
	}
	.tags a {
		color: var(--color-primary);
		text-decoration: none;
	}
	.tags a:hover {
		text-decoration: underline;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.btn {
		font-size: 0.78rem;
		font-weight: 700;
		padding: 0.7rem 1.2rem;
		border: 1px solid var(--color-on-surface);
		color: var(--color-on-surface);
		text-decoration: none;
	}
	.btn:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: var(--color-on-primary);
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
		border: 1px solid var(--color-outline-variant);
	}
</style>
