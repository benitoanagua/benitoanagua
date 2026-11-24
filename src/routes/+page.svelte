<script lang="ts">
	import { getPersonalInfo, getEducation } from '$lib/data/cv-loader';
	import { loadSiteData } from '$lib/data/site-loader';
	import { SITE_URL } from '$lib/config';
	import { lang } from '$lib/state/lang.svelte';
	import { getNavItems } from '$lib/data/nav';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import FeaturedProjects from '$lib/components/FeaturedProjects.svelte';
	import { projectsCopy } from '$lib/data/projects-copy';

	const personal = $derived(getPersonalInfo());
	const education = $derived(getEducation());
	const site = $derived(loadSiteData());
	const navItems = $derived(getNavItems());
	const projectsUi = $derived(projectsCopy(lang.current));

	const nameParts = $derived(personal.name.split(' '));
	const firstName = $derived(nameParts[0]);
	const surname = $derived(personal.name.slice(firstName.length).trim());

	const paths = $derived([
		{ href: '/habilidades', num: '§ 01', label: site.home.skills_label, text: site.home.skills_text },
		{
			href: '/experiencia',
			num: '§ 02',
			label: site.home.experience_label,
			text: site.home.experience_text
		},
		{ href: '/proyectos', num: '§ 03', label: navItems[1].label, text: projectsUi.homeCard }
	]);

	const profileLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'ProfilePage',
			mainEntity: {
				'@type': 'Person',
				name: personal.name,
				description: site.meta.description,
				url: SITE_URL,
				jobTitle: 'Business Applications Analyst, Software Developer and Product Designer',
				knowsAbout: ['Software Development', 'Product Design', 'Functional Analysis', 'Business Applications', 'Digital Design']
			}
		}).replace(/</g, '\\u003c')
	);
</script>

<svelte:head>
	<title>{personal.name} — {site.meta.tagline}</title>
	<meta name="description" content={`${personal.name} — ${site.meta.description}`} />
	<meta
		name="keywords"
		content="professional skills, work experience, software development, product design, functional analysis"
	/>

	<!-- Schema.org markup for home page -->
	{@html `<script type="application/ld+json">${profileLd}</` + 'script>'}
</svelte:head>

<PortalLayout>
	<div class="folio-page">
		<!-- ══ HERO ══ -->
		<section class="hero">
			<p class="kicker">{site.home.eyebrow}</p>
			<h1 class="hero-name">
				{firstName}
				{#if surname}<em class="surname">{surname}</em>{/if}
			</h1>
			<p class="hero-lead">{site.meta.description}</p>
		</section>

		<!-- ══ PATHS: ruled index of the site ══ -->
		<section class="paths" aria-labelledby="paths-title">
			<h2 id="paths-title" class="kicker paths-title">{site.home.explore_title}</h2>
			<div class="capability-links">
				{#each paths as path}
					<a class="cap-link" href={path.href}>
						<span class="cap-num kicker">{path.num}</span>
						<span class="cap-title">{path.label}</span>
						<span class="cap-text">{path.text}</span>
						<span class="cap-arrow" aria-hidden="true">↗</span>
					</a>
				{/each}
			</div>
		</section>

		<FeaturedProjects />

		<!-- ══ CONNECTIVE NODES ══ -->
		<section class="nodes-section" aria-label={site.home.contact_title}>
			<div class="rule-thick" aria-hidden="true"></div>
			<div class="nodes-grid">
				<div class="node-box contact-module">
					<h2 class="kicker node-title">{site.home.contact_title}</h2>
					<div class="link-stack">
						<a href="mailto:{personal.email}" class="node-link">
							<span>{site.home.email_label}</span>
							<span aria-hidden="true">↗</span>
						</a>
						<a href={personal.linkedin} target="_blank" rel="noopener" class="node-link">
							<span>{site.home.linkedin_label}</span>
							<span aria-hidden="true">↗</span>
						</a>
					</div>
				</div>

				<div class="node-box education-module">
					<h2 class="kicker node-title">{site.home.education_title}</h2>
					<div class="edu-bits">
						{#each education.slice(0, 2) as edu}
							<div class="edu-bit">
								<span class="year meta">{edu.year}</span>
								<span class="info">{edu.degree} — {edu.institution}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	</div>
</PortalLayout>

<style>
	.folio-page {
		display: flex;
		flex-direction: column;
		gap: var(--space-16);
	}
	@media (min-width: 768px) {
		.folio-page {
			gap: var(--space-24);
		}
	}

	/* ── HERO ── */
	.hero {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		padding-block: var(--space-8);
	}
	.kicker {
		margin-bottom: var(--space-2);
	}
	.hero-name {
		font-size: var(--text-display);
		line-height: var(--leading-display);
		letter-spacing: var(--tracking-display);
		font-weight: 700;
	}
	.surname {
		font-style: italic;
		font-weight: 500;
		color: var(--color-primary);
	}
	.hero-lead {
		max-width: 52ch;
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
	}

	/* ── PATHS ── */
	.paths {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.paths-title {
		margin-bottom: var(--space-2);
	}
	.capability-links {
		display: flex;
		flex-direction: column;
	}
	.cap-link {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-areas:
			'num title arrow'
			'num text arrow';
		column-gap: var(--space-6);
		align-items: baseline;
		padding: var(--space-6) 0;
		border-top: var(--rule-hair) solid var(--color-on-background);
		color: inherit;
		text-decoration: none;
	}
	.cap-link:last-child {
		border-bottom: var(--rule-hair) solid var(--color-on-background);
	}
	.cap-link:hover {
		background: var(--color-surface-container);
	}
	.cap-num {
		grid-area: num;
	}
	.cap-title {
		grid-area: title;
		font-family: var(--font-display);
		font-size: var(--text-section);
		line-height: var(--leading-section);
		font-weight: 700;
	}
	.cap-text {
		grid-area: text;
		font-size: var(--text-body);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
		max-width: 60ch;
	}
	.cap-arrow {
		grid-area: arrow;
		color: var(--color-primary);
	}
	@media (max-width: 560px) {
		.cap-link {
			grid-template-columns: auto 1fr;
			grid-template-areas:
				'num title'
				'num text'
				'num arrow';
		}
	}

	/* ── NODES ── */
	.nodes-section {
		display: flex;
		flex-direction: column;
	}
	.nodes-grid {
		display: grid;
		grid-template-columns: 1fr;
	}
	@media (min-width: 768px) {
		.nodes-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.node-box + .node-box {
			border-left: var(--rule-hair) solid var(--color-on-background);
		}
	}
	.node-box {
		padding: var(--space-8) var(--space-6) var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		border-bottom: var(--rule-hair) solid var(--color-on-background);
	}
	@media (min-width: 768px) {
		.node-box {
			border-bottom: none;
		}
	}
	.node-title {
		margin-bottom: 0;
	}
	.link-stack {
		display: flex;
		flex-direction: column;
	}
	.node-link {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) 0;
		border-top: var(--rule-hair) dashed var(--color-outline-variant);
		color: var(--color-on-background);
		font-size: var(--text-meta);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.node-link:first-child {
		border-top: 0;
	}
	.node-link:hover {
		color: var(--color-primary);
	}
	.edu-bits {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.edu-bit {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding-top: var(--space-3);
		border-top: var(--rule-hair) dashed var(--color-outline-variant);
	}
	.edu-bit:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.info {
		font-size: var(--text-meta);
		line-height: var(--leading-body);
	}
</style>
