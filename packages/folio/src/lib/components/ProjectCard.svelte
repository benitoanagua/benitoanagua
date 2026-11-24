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
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="visual" href={project.href} aria-label={labels.view + ' ' + project.title}>
			<img src={project.image} alt={project.imageAlt || project.title} loading="lazy" />
		</a>
	{/if}
	<div class="body">
		<div class="meta">
			{#if project.category}<span>{project.category}</span>{/if}
			{#if project.year}<span>{project.year}</span>{/if}
		</div>
		<h3 class="ds-title">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={project.href}>{project.title}<span aria-hidden="true">↗</span></a>
		</h3>
		<p class="ds-description">{project.description}</p>
		{#if project.tags?.length}
			<p class="tags" aria-label={labels.tech}>{project.tags.join(' · ')}</p>
		{/if}
		<div class="links">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="case label" href={project.href}>{labels.case} <span aria-hidden="true">↗</span></a>
			{#if project.sourceHref}
				<a class="label" href={project.sourceHref} target="_blank" rel="noreferrer external"
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
		background: transparent;
		border: 0;
		border-radius: 0;
		color: var(--color-on-background);
	}
	.visual {
		display: block;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--color-surface-container-low);
	}
	.visual img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--duration-base);
	}
	.visual:hover img {
		transform: scale(1.015);
	}
	.body {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: var(--space-5) 0 0;
	}
	.meta {
		display: flex;
		gap: var(--space-3);
		color: var(--color-ink-soft);
	}
	.ds-title {
		margin: var(--space-3) 0 0;
		font-family: var(--font-display);
		font-size: var(--text-section);
		line-height: var(--leading-section);
		font-weight: 600;
	}
	.ds-title a {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		color: inherit;
		text-decoration: none;
		transition: color var(--duration-fast);
	}
	.ds-title a span {
		color: var(--color-primary);
	}
	.ds-title a:hover {
		color: var(--color-primary);
	}
	.ds-description {
		margin: var(--space-3) 0 0;
		font-size: var(--text-body);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
	}
	.tags {
		margin: var(--space-4) 0 0;
		color: var(--color-ink-soft);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-5);
		margin-top: auto;
		padding-top: var(--space-5);
	}
	.links a {
		color: var(--color-primary);
		text-decoration: none;
	}
	.links a:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.case {
		margin-right: auto;
	}
</style>
