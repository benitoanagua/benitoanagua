<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Divider,
		Marginalia,
		Metric,
		Notice,
		ProjectCard,
		Pullquote,
		SectionHeading,
		SocialLinks,
		TextField,
		Timeline
	} from '$folio';

	let email = $state('');
	let theme = $state<'light' | 'dark'>('light');

	const timeline = [
		{
			period: 'Period',
			title: 'Role or milestone',
			organization: 'Organization',
			description: 'Illustrative content; replace with verified information.'
		}
	];
	const project = {
		title: 'Example project',
		description: 'An illustrative project card, not a portfolio claim.',
		href: '#examples',
		category: 'Category',
		year: 'Year',
		tags: ['Svelte', 'TypeScript']
	};
	const links = [{ label: 'GitHub', href: 'https://github.com/benitoanagua' }];

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<svelte:head>
	<title>FOLIO — Component Catalog</title>
</svelte:head>

<main class="catalog">
	<header class="masthead">
		<div>
			<p class="kicker">FOLIO / SVELTE 5</p>
			<h1>Component<br /><em>catalog.</em></h1>
			<p class="intro">
				A living reference for the published components, tokens and accessible patterns.
			</p>
		</div>
		<Button variant="outline" onclick={toggleTheme}>Switch theme</Button>
	</header>

	<nav aria-label="Catalog sections">
		<a href="#foundations">Foundations</a>
		<a href="#actions">Actions</a>
		<a href="#content">Content</a>
		<a href="#forms">Forms</a>
		<a href="#editorial">Editorial</a>
	</nav>

	<section id="foundations">
		<SectionHeading
			eyebrow="01 / FOUNDATIONS"
			title="Tokens and hierarchy"
			description="Shared CSS custom properties define color, typography, spacing and focus."
		/>
		<div class="grid">
			<Card title="Palette">
				<div class="swatches">
					<span class="paper">Paper</span>
					<span class="ink">Ink</span>
					<span class="accent">Accent</span>
				</div>
			</Card>
			<Card title="Type">
				<p class="display">Reading first.</p>
				<p class="meta">KICKER / META / LABEL</p>
				<p>Body text uses a readable measure and generous leading.</p>
			</Card>
		</div>
	</section>

	<section id="actions">
		<SectionHeading eyebrow="02 / ACTIONS" title="Button, Badge, Card and Divider" />
		<div class="grid">
			<Card title="Button">
				<div class="examples">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
				</div>
			</Card>
			<Card title="Badge">
				<div class="examples">
					<Badge>Neutral</Badge>
					<Badge tone="success">Success</Badge>
					<Badge tone="warning">Warning</Badge>
					<Badge tone="danger">Danger</Badge>
				</div>
				<Divider label="Divider variants" variant="double" />
			</Card>
		</div>
	</section>

	<section id="content">
		<SectionHeading eyebrow="03 / CONTENT" title="Project, timeline, links and metric" />
		<div class="grid">
			<Card title="ProjectCard">
				<ProjectCard {project} />
			</Card>
			<Card title="Timeline">
				<Timeline items={timeline} />
			</Card>
			<Card title="SocialLinks">
				<SocialLinks items={links} label="Example profile links" />
			</Card>
			<Card title="Metric">
				<Metric
					value="—"
					label="Verified metric"
					note="Use a substantiated value; this sample makes no numeric claim."
				/>
			</Card>
		</div>
	</section>

	<section id="forms">
		<SectionHeading eyebrow="04 / FORMS" title="TextField and Notice" />
		<div class="grid">
			<Card title="TextField">
				<TextField
					id="catalog-email"
					label="Email address"
					placeholder="name@example.com"
					hint="Local example only; no data is submitted."
					bind:value={email}
				/>
				<p class="meta">Value: {email ? 'entered' : 'empty'}</p>
			</Card>
			<Card title="Notice">
				<Notice tone="note" label="Note">Use a calm notice for supporting context.</Notice>
				<Notice tone="warning" label="Warning">
					Communicate states with text, not color alone.
				</Notice>
			</Card>
		</div>
	</section>

	<section id="editorial">
		<SectionHeading eyebrow="05 / EDITORIAL" title="SectionHeading, Pullquote and Marginalia" />
		<div class="grid">
			<Card title="Pullquote">
				<Pullquote cite="FOLIO principle">Clarity is a feature, not decoration.</Pullquote>
			</Card>
			<Card title="Marginalia">
				<Marginalia>
					{#snippet aside()}
						<div>
							<span class="meta">Aside</span>
							<p>Metadata or annotation</p>
						</div>
					{/snippet}
					<p>
						Keep the primary reading column focused. Supporting information belongs in the margin
						and remains readable on narrow screens.
					</p>
				</Marginalia>
			</Card>
		</div>
	</section>

	<footer>
		<p class="meta">FOLIO · SVELTE 5 · COMPONENT REFERENCE</p>
		<a href="https://github.com/benitoanagua/benitoanagua" target="_blank" rel="noreferrer external"
			>Source repository ↗</a
		>
	</footer>
</main>

<style>
	.catalog {
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: var(--space-8) var(--space-4) var(--space-20);
		display: grid;
		gap: var(--space-12);
	}
	.masthead {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-8);
		padding: var(--space-12) 0;
		border-bottom: var(--rule-thick) double var(--color-on-background);
	}
	h1 {
		margin: var(--space-4) 0;
		font-size: var(--text-display);
		line-height: var(--leading-display);
	}
	h1 em {
		color: var(--color-primary);
		font-weight: 500;
	}
	.intro {
		max-width: var(--measure);
		color: var(--color-on-surface-variant);
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4) var(--space-8);
		padding-bottom: var(--space-4);
		border-bottom: var(--rule-hair) solid var(--color-outline-variant);
	}
	nav a {
		color: var(--color-on-background);
	}
	section {
		display: grid;
		gap: var(--space-6);
		scroll-margin-top: var(--space-8);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
	}
	.examples,
	.swatches {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
	}
	.swatches span {
		min-width: 5rem;
		padding: var(--space-4);
		border: var(--rule-hair) solid var(--color-outline-variant);
	}
	.paper {
		background: var(--color-background);
		color: var(--color-on-background);
	}
	.ink {
		background: var(--color-on-background);
		color: var(--color-background);
	}
	.accent {
		background: var(--color-primary);
		color: var(--color-on-primary);
	}
	.display {
		font: var(--text-title) / var(--leading-title) var(--font-display);
	}
	footer {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-4);
		padding-top: var(--space-4);
		border-top: var(--rule-hair) solid var(--color-outline-variant);
	}
	@media (max-width: 700px) {
		.masthead {
			align-items: start;
			flex-direction: column;
		}
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
