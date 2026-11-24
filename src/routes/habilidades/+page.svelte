<script lang="ts">
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import { getSkillProfiles, getSkillCategories } from '$lib/data/skill-profiles';
	import { uiCopy } from '$lib/data/ui-copy';
	import { slugify } from '$lib/utils/slug';
	import { lang } from '$lib/state/lang.svelte';

	const copy = $derived(uiCopy(lang.current).skills);
	const skills = $derived(getSkillProfiles());
	const categories = $derived(getSkillCategories());

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
			.map((category) => ({
				category,
				id: slugify(category),
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
			<p class="eyebrow mono">{copy.eyebrow}</p>
			<h1>{copy.title}</h1>
			<p class="lead">{copy.intro}</p>
			<p class="summary mono">{copy.summary(skills.length, categories.length)}</p>
		</header>

		<div class="tools">
			<div class="search">
				<label class="mono" for="skill-search">{copy.searchLabel}</label>
				<div class="search-field">
					<input
						id="skill-search"
						type="search"
						autocomplete="off"
						placeholder={copy.searchPlaceholder}
						bind:value={query}
					/>
					{#if query}
						<button type="button" class="clear mono" onclick={() => (query = '')}>
							{copy.clear}
						</button>
					{/if}
				</div>
			</div>

			<nav class="jump" aria-label={copy.categoriesLabel}>
				<span class="jump-label mono">{copy.categoriesLabel}</span>
				<ul>
					{#each groups as group}
						<li>
							<a class="mono" href={`#${group.id}`}>
								{group.category} <span>{group.items.length}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<p class="results mono" role="status" aria-live="polite">
				{query ? copy.results(visible.length) : ''}
			</p>
		</div>

		{#each groups as group (group.id)}
			<section class="category" id={group.id} aria-labelledby={`${group.id}-title`}>
				<div class="category-head">
					<h2 id={`${group.id}-title`}>{group.category}</h2>
					<span class="mono">{group.items.length}</span>
				</div>
				<div class="skill-grid">
					{#each group.items as skill (skill.slug)}
						<a class="skill-card" href={`/habilidades/${skill.slug}`}>
							<div class="skill-name">
								<h3>{skill.name}</h3>
								<span aria-hidden="true">↗</span>
							</div>
							<p>{copy.roles(skill.focusTitles.length)}</p>
							<ul class="focus-tags">
								{#each skill.focusTitles as focus}
									<li>{focus}</li>
								{/each}
							</ul>
							<span class="card-link mono">{copy.open}</span>
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
		background: var(--color-surface);
		border: 1px solid var(--color-outline-variant);
	}
	.eyebrow {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		color: var(--color-primary);
		margin-bottom: 1.25rem;
	}
	h1 {
		font-size: clamp(2.3rem, 6vw, 5rem);
		line-height: 1.04;
		letter-spacing: -0.045em;
		max-width: 900px;
		text-transform: none;
	}
	.lead {
		max-width: 62ch;
		color: var(--color-on-surface-variant);
		line-height: 1.75;
		margin-top: 1.5rem;
	}
	.summary {
		font-size: 0.75rem;
		color: var(--color-primary);
		margin-top: 2rem;
	}

	/* ── Herramientas: búsqueda + salto a categoría ── */
	.tools {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.search label,
	.jump-label {
		display: block;
		font-size: 0.75rem;
		color: var(--color-on-surface-variant);
		margin-bottom: 0.4rem;
	}
	.search-field {
		display: flex;
		gap: 0.5rem;
		max-width: 28rem;
	}
	.search-field input {
		flex: 1;
		min-height: 44px;
		padding: 0 var(--space-3);
		font: inherit;
		color: var(--color-on-surface);
		background: var(--color-surface);
		border: 1px solid var(--color-outline);
	}
	.clear {
		min-height: 44px;
		padding: 0 var(--space-3);
		font-size: 0.75rem;
		color: var(--color-primary);
		background: transparent;
		border: 1px solid var(--color-outline-variant);
	}
	.jump ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
	}
	.jump a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 44px;
		padding: 0 var(--space-3);
		font-size: 0.75rem;
		font-weight: 700;
		text-decoration: none;
		color: var(--color-on-surface-variant);
		border: 1px solid var(--color-outline-variant);
	}
	.jump a:hover {
		color: var(--color-on-surface);
		border-color: var(--color-outline);
	}
	.jump a span {
		font-weight: 400;
		opacity: 0.7;
	}
	.results {
		min-height: 1.2em;
		font-size: 0.75rem;
		color: var(--color-on-surface-variant);
	}
	.empty {
		color: var(--color-on-surface-variant);
		line-height: 1.7;
	}

	/* ── Categorías y tarjetas ── */
	.category {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		scroll-margin-top: 5rem;
	}
	.category-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-outline-variant);
		padding-bottom: 0.8rem;
	}
	.category-head h2 {
		font-size: 1.4rem;
		text-transform: none;
	}
	.category-head span {
		font-size: 0.75rem;
		color: var(--color-primary);
	}
	.skill-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.skill-card {
		display: flex;
		flex-direction: column;
		min-height: 170px;
		padding: 1.1rem;
		border: 1px solid var(--color-outline-variant);
		background: var(--color-surface);
		color: inherit;
		text-decoration: none;
		transition: box-shadow 0.2s;
	}
	.skill-card:hover {
		box-shadow: var(--ring-primary);
	}
	.skill-name {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: start;
	}
	.skill-name h3 {
		font-size: 1rem;
		text-transform: none;
	}
	.skill-name span {
		color: var(--color-primary);
	}
	.skill-card > p {
		font-size: 0.8125rem;
		color: var(--color-on-surface-variant);
		margin-top: 0.8rem;
	}
	.focus-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.65rem;
		list-style: none;
	}
	.focus-tags li {
		font-size: 0.75rem;
		padding: 0.2rem 0.4rem;
		border: 1px solid var(--color-outline-variant);
		color: var(--color-on-surface-variant);
	}
	.card-link {
		font-size: 0.75rem;
		color: var(--color-primary);
		margin-top: auto;
		padding-top: 1.2rem;
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
