<script lang="ts">
	export interface PortfolioProject {
		title: string;
		description: string;
		href: string;
		image?: string;
		imageAlt?: string;
		year?: string;
		category?: string;
		tags?: string[];
		sourceHref?: string;
	}
	export interface ProjectCardLabels {
		view: string;
		case: string;
		source: string;
		tech: string;
	}
	let {
		project,
		labels = { view: 'View', case: 'View case study', source: 'Source', tech: 'Technologies' }
	}: {
		project: PortfolioProject;
		labels?: ProjectCardLabels;
	} = $props();
</script>

<article class="ds-project-card">
	{#if project.image}
		<a class="visual" href={project.href} aria-label={labels.view + ' ' + project.title}>
			<img src={project.image} alt={project.imageAlt || project.title} loading="lazy" />
		</a>
	{/if}
	<div class="body">
		<div class="meta">
			{#if project.category}<span>{project.category}</span>{/if}
			{#if project.year}<span>{project.year}</span>{/if}
		</div>
		<h3 class="ds-title"><a href={project.href}>{project.title}</a></h3>
		<p class="ds-description">{project.description}</p>
		{#if project.tags?.length}
			<ul class="tags" aria-label={labels.tech}>
				{#each project.tags as tag}<li>{tag}</li>{/each}
			</ul>
		{/if}
		<div class="links">
			<a class="case label" href={project.href}
				>{labels.case} <span aria-hidden="true">↗</span></a
			>
			{#if project.sourceHref}
				<a class="label" href={project.sourceHref} target="_blank" rel="noreferrer"
					>{labels.source} <span aria-hidden="true">↗</span></a
				>
			{/if}
		</div>
	</div>
</article>

<style>
	.ds-project-card {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--color-surface-container);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		color: var(--color-on-background);
	}
	.visual {
		display: block;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--color-surface-container-high);
		border-bottom: var(--rule-hair) solid var(--color-outline-variant);
	}
	.visual img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.body {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: var(--space-6);
	}
	.meta {
		display: flex;
		gap: var(--space-3);
	}
	.ds-title {
		margin: var(--space-2) 0 0;
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: var(--leading-section);
		font-weight: 700;
	}
	.ds-title a {
		color: inherit;
	}
	.ds-description {
		margin: var(--space-2) 0 0;
		font-size: var(--text-body);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		padding: 0;
		margin: var(--space-4) 0 0;
		list-style: none;
	}
	.tags li {
		padding: 0.2rem 0.5rem;
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		color: var(--color-on-surface-variant);
		font-size: var(--text-meta);
	}
	.links {
		display: flex;
		gap: var(--space-6);
		margin-top: auto;
		padding-top: var(--space-6);
	}
	.links a {
		color: var(--color-primary);
	}
	.case {
		margin-right: auto;
	}
</style>
