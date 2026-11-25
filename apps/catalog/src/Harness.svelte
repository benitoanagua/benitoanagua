<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Divider,
		Flex,
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

	let clicks = $state(0);
	let email = $state('');
	let disabledClicks = $state(0);

	const project = {
		title: 'Harness project',
		description: 'Project card fixture for E2E coverage.',
		href: '#folio-project-card',
		category: 'Category',
		year: '2026',
		tags: ['Svelte', 'TypeScript'],
		sourceHref: 'https://example.com/source'
	};
	const timelineItems = [
		{ period: '2020', title: 'First role', organization: 'Org A', description: 'First entry' },
		{ period: '2024', title: 'Second role', organization: 'Org B', description: 'Second entry' }
	];
	const socialItems = [
		{ label: 'GitHub', href: 'https://github.com/example' },
		{ label: 'LinkedIn', href: 'https://linkedin.com/in/example' }
	];
</script>

<svelte:head><title>FOLIO harness</title></svelte:head>

<main>
	<section data-testid="folio-button">
		<h2>Button</h2>
		<Button onclick={() => clicks++}>Primary click</Button>
		<Button variant="secondary" size="sm">Secondary small</Button>
		<Button variant="outline" size="lg">Outline large</Button>
		<Button variant="ghost">Ghost</Button>
		<Button disabled onclick={() => disabledClicks++}>Disabled</Button>
		<Button loading>Loading</Button>
		<p data-testid="folio-button-count">{clicks}</p>
		<p data-testid="folio-button-disabled-count">{disabledClicks}</p>
	</section>

	<section data-testid="folio-badge">
		<h2>Badge</h2>
		<Badge>Neutral</Badge>
		<Badge tone="success">Success</Badge>
		<Badge tone="warning">Warning</Badge>
		<Badge tone="danger">Danger</Badge>
	</section>

	<section data-testid="folio-card">
		<h2>Card</h2>
		<Card title="Titled card">
			<p>Card body content.</p>
		</Card>
		<Card><p>Untitled card content.</p></Card>
	</section>

	<section data-testid="folio-divider">
		<h2>Divider</h2>
		<Divider variant="hair" />
		<Divider variant="soft" />
		<Divider variant="thick" />
		<Divider variant="double" />
		<Divider variant="space" />
		<Divider label="Labeled divider" variant="double" />
		<div style="display: flex; gap: 1rem; align-items: stretch; height: 4rem">
			<span>Left</span>
			<Divider orientation="vertical" variant="thick" />
			<span>Right</span>
		</div>
	</section>

	<section data-testid="folio-flex">
		<h2>Flex</h2>
		<Flex gap="4" padding="4" data-testid="folio-flex-column">
			<Badge>Item 1</Badge>
			<Badge>Item 2</Badge>
			<Badge>Item 3</Badge>
		</Flex>
		<Flex direction="row" gap="3" paddingBlock="2" paddingInline="4" data-testid="folio-flex-row">
			<Badge>Item 1</Badge>
			<Badge>Item 2</Badge>
			<Badge>Item 3</Badge>
		</Flex>
		<Flex
			direction="row"
			wrap="wrap"
			rowGap="6"
			columnGap="3"
			padding="4"
			data-testid="folio-flex-wrap"
		>
			<Badge>Item 1</Badge>
			<Badge>Item 2</Badge>
			<Badge>Item 3</Badge>
			<Badge>Item 4</Badge>
			<Badge>Item 5</Badge>
			<Badge>Item 6</Badge>
		</Flex>
	</section>

	<section data-testid="folio-text-field">
		<h2>TextField</h2>
		<TextField
			id="harness-email"
			label="Email address"
			placeholder="name@example.com"
			hint="We only use this locally."
			bind:value={email}
		/>
		<TextField
			id="harness-invalid"
			label="Invalid field"
			value="bad"
			error="This field has an error."
		/>
	</section>

	<section data-testid="folio-project-card">
		<h2>ProjectCard</h2>
		<ProjectCard {project} />
	</section>

	<section data-testid="folio-timeline">
		<h2>Timeline</h2>
		<Timeline items={timelineItems} />
		<Timeline items={[]} />
	</section>

	<section data-testid="folio-social-links">
		<h2>SocialLinks</h2>
		<SocialLinks items={socialItems} label="Harness profile links" />
		<SocialLinks items={[]} label="Empty links" />
	</section>

	<section data-testid="folio-metric">
		<h2>Metric</h2>
		<Metric value="42" label="Numeric value" note="With a note." />
		<Metric value="—" label="Non-numeric value" />
	</section>

	<section data-testid="folio-notice">
		<h2>Notice</h2>
		<Notice tone="note" label="Note">Note tone body.</Notice>
		<Notice tone="success" label="Success">Success tone body.</Notice>
		<Notice tone="warning" label="Warning">Warning tone body.</Notice>
		<Notice tone="error" label="Error">Error tone body.</Notice>
	</section>

	<section data-testid="folio-section-heading">
		<h2>SectionHeading</h2>
		<SectionHeading eyebrow="EYEBROW" title="Level two title" description="Optional description." />
		<SectionHeading eyebrow="EYEBROW" title="Level three title" level={3} align="center" rule />
	</section>

	<section data-testid="folio-pullquote">
		<h2>Pullquote</h2>
		<Pullquote cite="FOLIO">A pull quote with attribution.</Pullquote>
		<Pullquote>A pull quote without attribution.</Pullquote>
	</section>

	<section data-testid="folio-marginalia">
		<h2>Marginalia</h2>
		<Marginalia>
			{#snippet aside()}
				<div data-testid="folio-marginalia-aside"><span class="meta">Aside label</span></div>
			{/snippet}
			<p>Main column content.</p>
		</Marginalia>
	</section>
</main>
