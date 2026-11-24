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
	<div class="lobby-container">
		<!-- ══ LOBBY HERO: Structural Narrative ══ -->
		<section class="lobby-hero">
				<div class="header-terminal shared-boundary">
					<div class="terminal-top-bar mono">
						<span>{site.home.topbar}</span>
						<span class="status-light"></span>
					</div>

					<div class="main-spec">
						<p class="hero-label mono">{site.home.eyebrow}</p>

						<h1 class="hero-title">
							<span class="stroke-text">{personal.name.split(' ')[0]}</span>
							<span class="solid-text">{personal.name.split(' ')[1] || ''}</span>
						</h1>

						<div class="hero-divider">
							<div class="line"></div>
							<span class="mono">{site.meta.tagline.toUpperCase()}</span>
							<div class="line"></div>
						</div>

						<div class="hero-intro-box">
							<div class="summary-cursor"></div>
							<p class="hero-intro">{site.meta.description}</p>
						</div>
					</div>
				</div>
		</section>

		<!-- ══ PATHS: Grid-Boundary System ══ -->
		<section class="paths-section">
			<h2 class="section-tag mono">{site.home.explore_title}</h2>
		<div class="shared-boundary capability-links">
			<a href="/habilidades"><span class="mono">{site.home.skills_label}</span><strong>{site.home.skills_text}</strong><span class="material-symbols-outlined">arrow_outward</span></a>
			<a href="/experiencia"><span class="mono">{site.home.experience_label}</span><strong>{site.home.experience_text}</strong><span class="material-symbols-outlined">arrow_outward</span></a>
			<a href="/proyectos"><span class="mono">{navItems[1].label}</span><strong>{projectsCopy(lang.current).homeCard}</strong><span class="material-symbols-outlined">arrow_outward</span></a>
		</div>
		</section>
		<FeaturedProjects />

		<!-- ══ CONNECTIVE NODES: Linear Modules ══ -->
		<section class="nodes-section">
			<div class="shared-boundary nodes-grid">
				<div class="node-box contact-module">
					<h3 class="mono node-title">{site.home.contact_title}</h3>
					<div class="link-stack">
						<a href="mailto:{personal.email}" class="node-link">
							<span class="mono">{site.home.email_label}</span>
							<span class="material-symbols-outlined">mail</span>
						</a>
						<a href={personal.linkedin} target="_blank" rel="noopener" class="node-link">
							<span class="mono">{site.home.linkedin_label}</span>
							<span class="material-symbols-outlined">open_in_new</span>
						</a>
					</div>
				</div>

				<div class="node-box education-module">
					<h3 class="mono node-title">{site.home.education_title}</h3>
					<div class="edu-bits">
						{#each education.slice(0, 2) as edu}
							<div class="edu-bit">
								<span class="year mono">{edu.year}</span>
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
	.lobby-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-12);
	}
	@media (min-width: 768px) {
		.lobby-container {
			gap: var(--space-20);
		}
	}

	/* ── HERO ── */
	.header-terminal {
		display: flex;
		flex-direction: column;
		background: var(--color-surface);
		border: 1px solid var(--color-outline-variant);
		position: relative;
		overflow: hidden;
		text-align: center;
	}

	.terminal-top-bar {
		background: var(--color-surface-container);
		padding: var(--space-2) var(--space-4);
		font-size: 0.75rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-outline-variant);
		opacity: 0.7;
	}

	.status-light {
		width: 8px;
		height: 8px;
		background: var(--color-primary);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--color-primary);
		animation: blink 2s infinite;
	}

	.main-spec {
		padding: var(--space-10) var(--space-4);
	}
	@media (min-width: 768px) {
		.main-spec {
			padding: var(--space-20) var(--space-8);
		}
	}

	.hero-label {
		font-size: 0.75rem;
		opacity: 0.4;
		letter-spacing: 0.2em;
		margin-bottom: var(--space-6);
	}

	.hero-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-8);
	}

	.stroke-text {
		font-family: var(--font-display);
		font-size: clamp(3rem, 12vw, 8rem);
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px var(--color-primary);
		opacity: 0.3;
	}
	.solid-text {
		font-family: var(--font-display);
		font-size: clamp(3rem, 12vw, 8rem);
		line-height: 1;
		color: var(--color-primary);
		letter-spacing: 0.05em;
	}

	.hero-divider {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		font-size: 0.75rem;
		opacity: 0.6;
		margin: 0 auto var(--space-8) auto;
		max-width: 400px;
	}
	.hero-divider .line {
		flex: 1;
		height: 1px;
		background: var(--color-primary);
		opacity: 0.3;
	}

	.hero-intro-box {
		display: flex;
		justify-content: center;
		gap: var(--space-3);
		max-width: 60ch;
		margin: 0 auto;
	}
	.summary-cursor {
		width: 8px;
		height: 1.2em;
		background: var(--color-primary);
		margin-top: 4px;
		animation: blink 1s infinite;
	}
	.hero-intro {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.6;
		opacity: 0.9;
		text-align: left;
		letter-spacing: -0.02em;
	}

	/* ── PATHS GRID (Shared Boundary) ── */
	.paths-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.section-tag {
		font-size: 0.75rem;
		opacity: 0.4;
		border-left: 3px solid var(--color-primary);
		padding-left: var(--space-2);
	}

	/* ── NODES GRID ── */
	.nodes-grid {
		grid-template-columns: 1fr;
		border-top: 1px solid var(--color-outline-variant);
		border-left: 1px solid var(--color-outline-variant);
		gap: 0;
	}
	@media (min-width: 768px) {
		.nodes-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.node-box {
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		border-right: 1px solid var(--color-outline-variant);
		border-bottom: 1px solid var(--color-outline-variant);
		position: relative;
		background: var(--color-surface);
	}

	.node-title {
		font-size: 0.75rem;
		opacity: 0.4;
	}

	.link-stack {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: var(--color-outline-variant);
		border: 1px solid var(--color-outline-variant);
	}
	.node-link {
		background: var(--color-surface);
		padding: var(--space-3) var(--space-4);
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-decoration: none;
		color: inherit;
		transition: background 0.2s;
	}
	.node-link:hover {
		background: var(--color-surface-container-low);
		color: var(--color-primary);
	}
	.node-link span:first-child {
		font-size: 0.75rem;
		font-weight: 700;
	}

	.edu-bits {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.edu-bit {
		display: flex;
		flex-direction: column;
	}
	.edu-bit .year {
		font-size: 0.75rem;
		color: var(--color-primary);
		font-weight: 700;
	}
	.edu-bit .info {
		font-size: 0.8125rem;
		opacity: 0.8;
	}
	.capability-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
	.capability-links>a{display:grid;grid-template-columns:1fr auto;gap:.8rem;padding:1.5rem;border:1px solid var(--color-outline-variant);background:var(--color-surface);color:inherit;text-decoration:none}
	.capability-links>a .mono{grid-column:1/-1;font-size: 0.75rem;color:var(--color-primary);letter-spacing:.04em}
	.capability-links>a strong{font-size:clamp(1rem,2vw,1.5rem);line-height:1.4;font-weight:500}
	.capability-links>a .material-symbols-outlined{color:var(--color-primary)}
	@media(max-width:900px){.capability-links{grid-template-columns:1fr}}
</style>
