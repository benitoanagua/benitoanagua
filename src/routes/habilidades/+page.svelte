<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import SectionHeading from '$lib/design-system/components/SectionHeading.svelte';
	import TextField from '$lib/design-system/components/TextField.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import { getSkillProfiles, getSkillCategories } from '$lib/data/skill-profiles';
	import { uiCopy } from '$lib/data/ui-copy';
	import { slugify } from '$lib/utils/slug';
	import { lang } from '$lib/state/lang.svelte';

	const copy = $derived(uiCopy(lang.current).skills);
	const skills = $derived(getSkillProfiles(page.data.portfolio));
	const categories = $derived(getSkillCategories(page.data.portfolio));

	let query = $state('');
	const normalize = (value: string) =>
		value
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim();

	const visible = $derived.by(() => {
		const q = normalize(query);
		if (!q) return skills;
		return skills.filter((s) =>
			normalize([s.name, s.category, ...s.focusTitles].join(' ')).includes(q)
		);
	});
	const groups = $derived(
		categories
			.map((category, index) => ({
				category,
				id: slugify(category),
				num: `§ 0${index + 1}`,
				items: visible.filter((s) => s.category === category)
			}))
			.filter((g) => g.items.length)
	);
</script>

<svelte:head>
	<title>{copy.title} — Benito Anagua</title>
	<meta name="description" content={copy.intro} />
</svelte:head>

<PortalLayout>
	<div class="skills-page">
		<header class="intro">
			<p class="eyebrow kicker">{copy.eyebrow}</p>
			<h1>{copy.title}</h1>
			<p class="lead">{copy.intro}</p>
			<p class="summary meta">{copy.summary(skills.length, categories.length)}</p>
		</header>

		<div class="tools">
			<div class="search">
				<TextField
					id="skill-search"
					label={copy.searchLabel}
					type="search"
					placeholder={copy.searchPlaceholder}
					bind:value={query}
				/>
				{#if query}
					<Button variant="ghost" size="sm" onclick={() => (query = '')}>
						{copy.clear}
					</Button>
				{/if}
			</div>

			<nav class="jump" aria-label={copy.categoriesLabel}>
				<span class="jump-label meta">{copy.categoriesLabel}</span>
				<ul>
					{#each groups as group (group.id)}
						<li>
							<a class="jump-link" href={`#${group.id}`}>
								{group.category} <span class="count">{group.items.length}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<p class="results meta" role="status" aria-live="polite">
				{query ? copy.results(visible.length) : ''}
			</p>
		</div>

		{#each groups as group (group.id)}
			<section class="category" id={group.id} aria-labelledby={`${group.id}-title`}>
				<div class="cat-head">
					<SectionHeading eyebrow={group.num} title={group.category} />
					<span class="meta cat-count">{group.items.length}</span>
				</div>
				<div class="skill-grid">
					{#each group.items as skill (skill.slug)}
						<a class="skill-card" href={resolve('/habilidades/[slug]', { slug: skill.slug })}>
							<div class="skill-name">
								<h3>{skill.name}</h3>
								<span class="arrow" aria-hidden="true">↗</span>
							</div>
							<p>{copy.roles(skill.focusTitles.length)}</p>
							<ul class="focus-tags">
								{#each skill.focusTitles as focus (focus)}
									<li>{focus}</li>
								{/each}
							</ul>
							<span class="card-link label">{copy.open}</span>
						</a>
					{/each}
				</div>
			</section>
		{:else}
			<p class="empty">{copy.noResults(query)}</p>
		{/each}
	</div>
</PortalLayout>

<style>
	.skills-page {
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 3.5rem);
	}
	.intro {
		padding: clamp(2rem, 6vw, 5rem);
		background: var(--color-surface-container);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	.eyebrow {
		margin-bottom: var(--space-4);
	}
	.lead {
		max-width: var(--measure);
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
		color: var(--color-on-surface-variant);
		margin-top: var(--space-6);
	}
	.summary {
		margin-top: var(--space-8);
	}

	/* ── Herramientas: búsqueda + salto a categoría ── */
	.tools {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.search {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-2);
		max-width: 30rem;
	}
	.search :global(.ds-field) {
		width: 100%;
	}
	.jump-label {
		display: block;
		margin-bottom: var(--space-3);
	}
	.jump ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		list-style: none;
	}
	.jump-link {
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
	.jump-link:hover {
		color: var(--color-on-background);
		border-color: var(--color-on-background);
	}
	.jump-link .count {
		margin-left: var(--space-2);
		font-weight: 400;
		opacity: 0.7;
	}
	.results {
		min-height: 1.2em;
	}
	.empty {
		color: var(--color-on-surface-variant);
		line-height: var(--leading-body);
	}

	/* ── Categorías y tarjetas ── */
	.category {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		scroll-margin-top: 5rem;
	}
	.cat-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4);
	}
	.cat-head :global(.ds-section-heading) {
		flex: 1;
	}
	.cat-count {
		padding-top: var(--space-8);
	}
	.skill-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-3);
	}
	.skill-card {
		display: flex;
		flex-direction: column;
		min-height: 170px;
		padding: var(--space-4);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: inherit;
		text-decoration: none;
		transition: border-color var(--duration-fast);
	}
	.skill-card:hover {
		border-color: var(--color-on-background);
	}
	.skill-name {
		display: flex;
		justify-content: space-between;
		gap: var(--space-2);
		align-items: start;
	}
	.skill-name h3 {
		font-size: 1.25rem;
		text-transform: none;
	}
	.arrow {
		color: var(--color-primary);
	}
	.skill-card > p {
		font-size: var(--text-meta);
		color: var(--color-on-surface-variant);
		margin-top: var(--space-3);
	}
	.focus-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-3);
		list-style: none;
	}
	.focus-tags li {
		font-size: var(--text-meta);
		padding: 0.2rem 0.5rem;
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		color: var(--color-on-surface-variant);
	}
	.card-link {
		color: var(--color-primary);
		margin-top: auto;
		padding-top: var(--space-4);
	}
	@media (max-width: 850px) {
		.skill-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 560px) {
		.skill-grid {
			grid-template-columns: 1fr;
		}
		.skill-card {
			min-height: 135px;
		}
	}
</style>
