<script lang="ts">
	import {
		ActionLink,
		Badge,
		Button,
		Card,
		Divider,
		Flex,
		Marginalia,
		Metric,
		Notice,
		PageHeader,
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

	const usage = [
		"import '@benitoanagua/folio/styles.css';",
		"import { Button, Notice } from '@benitoanagua/folio';",
		'',
		'<Notice tone="note" label="Note">Supporting context.</Notice>',
		'<Button variant="outline" onclick={() => console.log("go")}>Continue</Button>'
	].join('\n');

	const dividerVariants = ['hair', 'thick', 'double'] as const;

	const contracts = [
		{
			name: 'ActionLink',
			props: 'title, description, href, actionLabel?',
			defaults: 'Explore section',
			detail: 'text-first editorial link with visible focus and descriptive destination'
		},
		{
			name: 'Badge',
			props: 'tone?',
			defaults: 'neutral',
			detail: 'neutral · success · warning · danger'
		},
		{
			name: 'Button',
			props: 'variant?, size?, disabled?, loading?, onclick?',
			defaults: 'primary · md · false · false',
			detail: 'primary · secondary · outline · ghost; sm · md · lg'
		},
		{
			name: 'Card',
			props: 'title?',
			defaults: '—',
			detail: 'children; title is a visual label, add semantic headings in content'
		},
		{
			name: 'Divider',
			props: 'orientation?, variant?, label?',
			defaults: 'horizontal · soft',
			detail: 'hair · soft · thick · double · space'
		},
		{
			name: 'Flex',
			props:
				'direction?, align?, justify?, wrap?, gap?, rowGap?, columnGap?, padding?, paddingBlock?, paddingInline?',
			defaults: "column · stretch · start · nowrap · '4'",
			detail:
				'flex container with spacing tokens; row/column direction; independent row/column gap and block/inline padding'
		},
		{
			name: 'Marginalia',
			props: 'aside (snippet)',
			defaults: '—',
			detail: 'children + aside snippet; linear DOM reading order'
		},
		{
			name: 'Metric',
			props: 'value, label, note?',
			defaults: '—',
			detail: 'value and descriptive label required'
		},
		{
			name: 'Notice',
			props: 'label, tone?',
			defaults: 'note',
			detail: 'note · success · warning · error'
		},
		{
			name: 'PageHeader',
			props: 'title, eyebrow?, description?, level?',
			defaults: 'level 1',
			detail: 'semantic h1, h2 or h3 with shared FOLIO typography'
		},
		{
			name: 'ProjectCard',
			props: 'project, labels?',
			defaults: 'View / View case study / Source / Technologies',
			detail: 'project: title, description, href; optional image, year, category, tags, sourceHref'
		},
		{
			name: 'Pullquote',
			props: 'cite?',
			defaults: '—',
			detail: 'children; blockquote with optional citation'
		},
		{
			name: 'SectionHeading',
			props: 'title, eyebrow?, description?, align?, level?, rule?',
			defaults: 'left · 2 · false',
			detail: 'left · center; heading level 2 or 3'
		},
		{
			name: 'SocialLinks',
			props: 'items, compact?, label?',
			defaults: 'false · Social and professional links',
			detail: 'items: label + href; named nav'
		},
		{
			name: 'TextField',
			props: 'label, id, value?, placeholder?, hint?, type?, error?',
			defaults: "'' · '' · text",
			detail: 'visible label; hint/error associated to input'
		},
		{
			name: 'Timeline',
			props: 'items',
			defaults: '—',
			detail: 'period, title; optional organization, description, href'
		}
	];

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
		<a href="#admin-patterns">Admin patterns</a>
		<a href="#contracts">Component API</a>
		<a href="#reading-checks">Reading checks</a>
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
		<SectionHeading eyebrow="02 / ACTIONS" title="Button, Badge, Card, Divider and Flex" />
		<div class="grid">
			<Card title="Button">
				<div class="examples">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
				</div>
				<div class="examples">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
				</div>
			</Card>
			<Card title="Badge">
				<div class="examples">
					<Badge>Neutral</Badge>
					<Badge tone="success">Success</Badge>
					<Badge tone="warning">Warning</Badge>
					<Badge tone="danger">Danger</Badge>
				</div>
			</Card>
			<Card title="Divider">
				<div class="stack">
					{#each dividerVariants as variant (variant)}
						<div>
							<p class="meta">{variant}</p>
							<Divider {variant} />
						</div>
					{/each}
					<div>
						<p class="meta">labeled</p>
						<Divider label="Labeled section" variant="soft" />
					</div>
				</div>
			</Card>
			<Card title="Flex">
				<div class="stack">
					<div>
						<p class="meta">Column (default) with gap-4</p>
						<Flex gap="4" padding="4">
							<Badge>Item 1</Badge>
							<Badge>Item 2</Badge>
							<Badge>Item 3</Badge>
						</Flex>
					</div>
					<div>
						<p class="meta">Row with gap-3 and paddingBlock-2</p>
						<Flex direction="row" gap="3" paddingBlock="2" paddingInline="4">
							<Badge>Item 1</Badge>
							<Badge>Item 2</Badge>
							<Badge>Item 3</Badge>
						</Flex>
					</div>
					<div>
						<p class="meta">Row with wrap, rowGap-4, columnGap-2</p>
						<Flex direction="row" wrap="wrap" rowGap="4" columnGap="2" padding="3">
							<Badge>Item 1</Badge>
							<Badge>Item 2</Badge>
							<Badge>Item 3</Badge>
							<Badge>Item 4</Badge>
						</Flex>
					</div>
					<div>
						<p class="meta">Column with align=center</p>
						<Flex align="center" gap="3" padding="4">
							<Badge>Short</Badge>
							<Badge>Longer item</Badge>
							<Badge>Item</Badge>
						</Flex>
					</div>
				</div>
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

	<section id="admin-patterns">
		<PageHeader
			eyebrow="06 / APPLICATION PATTERNS"
			title="Admin workspace patterns"
			level={2}
			description="Reusable FOLIO components for dashboards and authenticated workspaces."
		/>
		<div class="grid">
			<Card title="PageHeader">
				<PageHeader
					eyebrow="WORKSPACE / OVERVIEW"
					title="Dashboard"
					level={3}
					description="Summarize a workspace with clear hierarchy and concise context."
				/>
			</Card>
			<Card title="ActionLink">
				<ActionLink
					title="Manage content"
					description="A descriptive route to a focused editing task."
					href="#admin-patterns"
					actionLabel="Open workspace"
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
				<Notice tone="success" label="Success">Confirm that an action finished correctly.</Notice>
				<Notice tone="warning" label="Warning">
					Communicate states with text, not color alone.
				</Notice>
				<Notice tone="error" label="Error">Describe what failed and how to recover.</Notice>
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

	<section id="contracts">
		<SectionHeading
			eyebrow="06 / COMPONENT CONTRACTS"
			title="The actual exported API"
			description="This index mirrors the 13 components exported by packages/folio/src/lib/index.ts. Full props and accessibility notes are documented in packages/folio/COMPONENTS.md."
		/>
		<div class="contract-list">
			{#each contracts as contract (contract.name)}
				<article class="contract">
					<h3>{contract.name}</h3>
					<p class="contract-props"><code>{contract.props}</code></p>
					<p class="contract-default">Defaults: {contract.defaults}</p>
					<p>{contract.detail}</p>
				</article>
			{/each}
		</div>
		<figure class="snippet">
			<figcaption class="meta">Usage</figcaption>
			<pre><code>{usage}</code></pre>
		</figure>
	</section>

	<section id="reading-checks">
		<SectionHeading
			eyebrow="07 / READING CHECKS"
			title="Spanish, long content and states"
			description="Fixtures for manual review of reflow, zoom, keyboard focus and text clarity; not a substitute for accessibility testing."
		/>
		<div class="grid">
			<Card title="Long Spanish text">
				<div lang="es">
					<Notice tone="warning" label="Atención">
						La información importante debe mantenerse completa, incluso con acentuación,
						¿preguntas?, ¡signos!, y frases largas que ocupen varias líneas sin ocultarse ni
						provocar desplazamiento horizontal.
					</Notice>
					<Pullquote cite="Ejemplo de lectura">
						Una interfaz clara permite comprender el contenido sin depender del color, del
						movimiento ni de una interacción escondida.
					</Pullquote>
				</div>
			</Card>
			<Card title="Input and action states">
				<div lang="es">
					<TextField
						id="reading-check-email"
						label="Correo electrónico"
						placeholder="nombre@ejemplo.com"
						hint="Campo de prueba; no se envía a ningún servicio."
						bind:value={email}
					/>
					<div class="examples">
						<Button disabled>Deshabilitado</Button>
						<Button loading>Procesando</Button>
					</div>
				</div>
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
	.stack {
		display: grid;
		gap: var(--space-4);
	}
	.snippet {
		margin: 0;
	}
	.snippet pre {
		margin: 0;
		padding: var(--space-4);
		border: var(--rule-hair) solid var(--color-outline-variant);
		background: var(--color-surface-container-low);
		color: var(--color-on-background);
		font: 400 var(--text-meta) / var(--leading-body) var(--font-mono);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
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

	.contract-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-4);
	}
	.contract {
		min-width: 0;
		padding: var(--space-4) 0;
		border-top: var(--rule-base) solid var(--color-outline-variant);
	}
	.contract h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-title);
		line-height: var(--leading-title);
	}
	.contract p {
		margin: var(--space-2) 0 0;
	}
	.contract-props {
		overflow-wrap: anywhere;
	}
	.contract-default {
		color: var(--color-on-surface-variant);
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
		.grid,
		.contract-list {
			grid-template-columns: 1fr;
		}
	}
</style>
