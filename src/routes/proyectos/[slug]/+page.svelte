<script lang="ts">
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Badge from '$lib/design-system/components/Badge.svelte';
	import Divider from '$lib/design-system/components/Divider.svelte';
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
			<header class="masthead">
				<div class="meta-row">
					<p class="eyebrow kicker">{copy.areas[project.area]} / {ui.detailEyebrow}</p>
					<a class="back label" href="/proyectos">← {copy.back}</a>
				</div>
				<h1>{project.title}</h1>
				<p class="lead">{project.summary}</p>
				<dl class="facts">
					<div>
						<dt class="meta">{copy.role}</dt>
						<dd>{project.role}</dd>
					</div>
					<div>
						<dt class="meta">{copy.year}</dt>
						<dd>{project.year}</dd>
					</div>
					{#if project.status}
						<div>
							<dt class="meta">{copy.status}</dt>
							<dd>{copy.statuses[project.status]}</dd>
						</div>
					{/if}
				</dl>
			</header>

			{#if project.context}
				<section class="block">
					<h2 class="block-title">{copy.context}</h2>
					<p class="prose-col">{project.context}</p>
				</section>
			{/if}

			{#if project.highlights.length}
				<section class="block">
					<h2 class="block-title">{copy.highlights}</h2>
					<ul class="highlights">
						{#each project.highlights as item}
							<li>{item}</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if project.result}
				<section class="block">
					<h2 class="block-title">{copy.result}</h2>
					<p class="prose-col">{project.result}</p>
				</section>
			{/if}

			{#if project.stack.length}
				<section class="block">
					<h2 class="block-title">{copy.stack}</h2>
					<ul class="stack">
						{#each project.stack as item}
							<li><Badge>{item}</Badge></li>
						{/each}
					</ul>
				</section>
			{/if}

			<section class="block">
				<h2 class="block-title">{copy.skills}</h2>
				<ul class="chips">
					{#each project.skills as skill}
						<li>
							{#if hasSkillPage(skill)}
								<a href={`/habilidades/${slugify(skill)}`}>{skill}</a>
							{:else}
								<span>{skill}</span>
							{/if}
						</li>
					{/each}
				</ul>
			</section>

			{#if links.length}
				<section class="block">
					<h2 class="block-title">{copy.links}</h2>
					<div class="actions">
						{#each links as l}
							<a class="btn label" href={l.href} rel="noopener" target="_blank">{l.label} ↗</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if related.length}
				<section class="block">
					<h2 class="block-title">{copy.related}</h2>
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

			<Divider />

			<footer class="foot">
				<a class="label" href="/proyectos">← {copy.back}</a>
			</footer>
		</article>
	{/if}
</PortalLayout>

<style>
	.detail {
		max-width: var(--container-md);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-16);
		padding: clamp(1.5rem, 4vw, 3rem) var(--space-4) var(--space-20);
	}
	.masthead {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.meta-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-4);
	}
	.eyebrow {
		margin: 0;
	}
	.back {
		color: var(--color-primary);
		font-size: var(--text-meta);
		font-weight: 700;
		text-decoration: none;
	}
	.back:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.masthead h1 {
		font-size: clamp(2.5rem, 1.8rem + 3vw, 4.5rem);
		line-height: var(--leading-tight);
	}
	.lead {
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
		max-width: var(--measure);
	}
	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-8);
	}
	.facts div {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
	}
	.facts dd {
		font-weight: 700;
		color: var(--color-on-background);
	}
	.block {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.block-title {
		font-size: var(--text-section);
	}
	.prose-col {
		max-width: var(--measure);
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
	}
	.highlights {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: var(--measure);
	}
	.highlights li {
		padding-left: var(--space-4);
		border-left: var(--rule-base) solid var(--color-primary);
		line-height: var(--leading-body);
	}
	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		list-style: none;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		list-style: none;
	}
	.chips a,
	.chips span {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 var(--space-4);
		font-size: var(--text-meta);
		font-weight: 700;
		text-decoration: none;
		color: var(--color-on-surface-variant);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	.chips a:hover {
		color: var(--color-on-background);
		border-color: var(--color-on-background);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		min-height: 3rem;
		padding: 0 var(--space-6);
		border: var(--rule-base) solid var(--color-on-background);
		border-radius: var(--radius-sm);
		color: var(--color-on-background);
		text-decoration: none;
	}
	.btn:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: var(--color-on-primary);
	}
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
		border: var(--rule-hair) solid var(--color-outline-variant);
	}
	.foot {
		padding-top: var(--space-4);
	}
	.foot a {
		color: var(--color-primary);
		font-size: var(--text-meta);
		font-weight: 700;
		text-decoration: none;
	}
	.foot a:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
