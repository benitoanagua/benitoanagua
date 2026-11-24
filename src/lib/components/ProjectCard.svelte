<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Project } from '$lib/types/Project';

	interface Props {
		project: Project;
		areaLabel: string;
		statusLabel?: string;
	}

	let { project, areaLabel, statusLabel }: Props = $props();
</script>

<article class="project">
	<a class="project-link" href={resolve('/proyectos/[slug]', { slug: project.slug })}>
		<div class="meta-line meta">
			<span>{areaLabel}</span>
			<span>{project.year}</span>
		</div>
		<h3>{project.title}<span class="arrow" aria-hidden="true">↗</span></h3>
		<p class="summary">{project.summary}</p>
	</a>
	<div class="details">
		{#if project.stack.length}
			<p class="stack meta" aria-label="Technology stack">
				{project.stack.slice(0, 4).join(' · ')}
			</p>
		{/if}
		{#if statusLabel}<span class="status meta">{statusLabel}</span>{/if}
	</div>
</article>

<style>
	.project {
		position: relative;
		min-width: 0;
		padding: var(--space-editorial-sm) var(--space-3);
		margin-inline: calc(var(--space-3) * -1);
		background: transparent;
		border: 0;
		border-radius: var(--radius-sm);
		transition: background-color var(--duration-fast);
	}
	.project-link {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		color: inherit;
		text-decoration: none;
	}
	.project:hover {
		background: var(--color-hover-surface);
	}
	.project-link:focus-visible {
		outline: var(--focus-ring);
		outline-offset: var(--focus-offset);
	}
	.meta-line {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		color: var(--color-ink-soft);
	}
	h3 {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 1.15rem + 0.8vw, 1.75rem);
		line-height: var(--leading-section);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		transition: color var(--duration-fast);
	}
	.arrow {
		flex: 0 0 auto;
		color: var(--color-primary);
		font-family: var(--font-ui);
		font-size: 1rem;
		opacity: 0.65;
		transition:
			transform var(--duration-fast),
			opacity var(--duration-fast);
	}
	.project:hover h3 {
		color: var(--color-primary);
	}
	.project:hover .arrow {
		opacity: 1;
		transform: translate(3px, -3px);
	}
	p {
		font-size: var(--text-meta);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
	}
	.summary {
		max-width: 62ch;
	}
	.details {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2) var(--space-4);
		margin-top: var(--space-4);
	}
	.stack {
		color: var(--color-ink-soft);
	}
	.status {
		color: var(--color-success);
	}
	.status::before {
		content: '·';
		margin-right: 0.4em;
		color: currentColor;
	}
	@media (prefers-reduced-motion: reduce) {
		.project,
		h3,
		.arrow {
			transition: none;
		}
	}
</style>
