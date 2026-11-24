<script lang="ts">
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import {
		Button,
		Badge,
		Card,
		TextField,
		Divider,
		ProjectCard,
		SectionHeading,
		Timeline,
		SocialLinks,
		Metric,
		Notice,
		Pullquote,
		Marginalia
	} from '$lib/design-system';

	let contactValue = $state('');
	const projects = [
		{
			title: 'Rescatados',
			description:
				'A product concept focused on connecting surplus resources with people who need them.',
			href: '#catalog',
			category: 'Product / Engineering',
			year: '2026',
			tags: ['Svelte', 'Domain modeling']
		},
		{
			title: 'TuCambio',
			description:
				'A digital experience built around clear flows, useful information, and accessible interaction.',
			href: '#catalog',
			category: 'Web application',
			year: '2025',
			tags: ['TypeScript', 'UX']
		}
	];
	const experience = [
		{
			period: '2024 — NOW',
			title: 'Software engineering',
			organization: 'Product and platform development',
			description:
				'Building reliable software, improving architecture, and translating business rules into maintainable systems.'
		},
		{
			period: 'EARLIER',
			title: 'Technical foundations',
			organization: 'Continuous learning',
			description:
				'Developing skills across backend systems, frontend interfaces, and delivery workflows.'
		}
	];
	const social = [
		{ label: 'GitHub', href: 'https://github.com/benitoanagua' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com' }
	];
</script>

<svelte:head>
	<title>Portfolio Design System — Benito Anagua</title>
	<meta
		name="description"
		content="Portfolio-oriented Svelte design system components and usage examples."
	/>
</svelte:head>

<PortalLayout>
	<main class="ds-page">
		<header class="hero">
			<p class="eyebrow kicker">DESIGN SYSTEM / SVELTE 5</p>
			<h1>Made for a<br /><em>portfolio.</em></h1>
			<p class="intro">
				A focused set of native Svelte components for presenting projects, experience, impact, and
				ways to connect.
			</p>
			<Button
				onclick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
			>
				Explore portfolio components
			</Button>
		</header>

		<section id="catalog">
			<SectionHeading
				eyebrow="01 / PROJECTS"
				title="Work worth showing"
				description="Project cards make the work, context, technologies, and next step easy to scan."
			/>
			<div class="project-grid">
				{#each projects as project (project.title)}
					<ProjectCard {project} />
				{/each}
			</div>
		</section>

		<section>
			<SectionHeading
				eyebrow="02 / ABOUT"
				title="A clear professional story"
				description="Use a compact timeline for experience, education, or meaningful milestones."
			/>
			<Timeline items={experience} />
		</section>

		<section>
			<SectionHeading eyebrow="03 / IMPACT" title="Show outcomes, not just activity" />
			<div class="metrics">
				<Metric
					value="12+"
					label="Years learning and building"
					note="Replace with a verified portfolio metric."
				/>
				<Metric
					value="20+"
					label="Projects and experiments"
					note="Use only a number you can substantiate."
				/>
				<Metric value="3" label="Areas of focus" note="Engineering · Product · Design" />
			</div>
		</section>

		<section>
			<SectionHeading
				eyebrow="04 / CONNECT"
				title="Make the next step obvious"
				description="A small set of professional links and a simple contact-field example."
			/>
			<Card title="Find me online">
				<SocialLinks items={social} />
				<Divider />
				<TextField
					id="ds-contact"
					label="Your email"
					placeholder="name@example.com"
					hint="Demo only — this field is not connected to a submission endpoint."
					bind:value={contactValue}
				/>
				<p class="field-value meta">Current value: {contactValue || '—'}</p>
			</Card>
		</section>

		<section>
			<SectionHeading eyebrow="05 / READING" title="Editorial pieces" />
			<div class="reading-grid">
				<Card title="Pull quote">
					<Pullquote>
						Good software is written once and read many times — clarity is a feature, not a
						decoration.
					</Pullquote>
				</Card>
				<Card title="Marginalia">
					<Marginalia>
						{#snippet aside()}
							<div class="mi">
								<span class="meta">Note</span>
								<span class="mi-val">Sidebar content sits beside the main column.</span>
							</div>
						{/snippet}
						<p class="mi-body">
							The main column carries the reading text; the aside carries metadata, context or short
							annotations that would interrupt the flow.
						</p>
					</Marginalia>
				</Card>
				<Card title="Notice">
					<Notice tone="note" label="Note">
						A quiet aside for clarifications, methodology notes or disclaimers.
					</Notice>
					<Notice tone="warning" label="Warning">
						The same slot, reserved for content that needs a stronger signal.
					</Notice>
				</Card>
			</div>
		</section>

		<section>
			<SectionHeading eyebrow="06 / PRIMITIVES" title="Small building blocks" />
			<div class="primitive-grid">
				<Card title="Actions">
					<div class="row">
						<Button>Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
				</Card>
				<Card title="Project metadata">
					<div class="row">
						<Badge>Featured</Badge>
						<Badge tone="success">Live</Badge>
						<Badge tone="warning">In progress</Badge>
					</div>
				</Card>
			</div>
		</section>
	</main>
</PortalLayout>

<style>
	.ds-page {
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) var(--space-4) var(--space-20);
		color: var(--color-on-background);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 3.5rem);
	}
	.hero {
		padding: clamp(2rem, 6vw, 5rem) 0;
		border-bottom: var(--rule-thick) double var(--color-on-background);
	}
	.eyebrow {
		margin-bottom: var(--space-4);
	}
	.hero h1 {
		margin: var(--space-4) 0 var(--space-6);
		font-size: clamp(3rem, 8vw, 6.5rem);
		line-height: var(--leading-tight);
	}
	.hero h1 em {
		color: var(--color-primary);
		font-style: italic;
	}
	.intro {
		max-width: var(--measure);
		margin: 0 0 var(--space-8);
		color: var(--color-on-surface-variant);
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
	}
	section {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.project-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
	}
	.metrics {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-6);
	}
	.reading-grid,
	.primitive-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
	}
	.mi {
		display: grid;
		gap: var(--space-1);
	}
	.mi-val {
		font-size: var(--text-meta);
		color: var(--color-on-background);
	}
	.mi-body {
		font-size: var(--text-meta);
		line-height: var(--leading-body);
		max-width: 60ch;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}
	.field-value {
		margin: var(--space-4) 0 0;
	}
	@media (max-width: 700px) {
		.project-grid,
		.reading-grid,
		.primitive-grid {
			grid-template-columns: 1fr;
		}
		.metrics {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}
	}
</style>
