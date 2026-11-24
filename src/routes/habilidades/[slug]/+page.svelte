<script lang="ts">
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import SkillProjects from '$lib/components/SkillProjects.svelte';
	import { lang } from '$lib/state/lang.svelte';
	import { getSkillProfiles, type SkillProfile } from '$lib/data/skill-profiles';
	import { getPersonalInfo } from '$lib/data/cv-loader';
	import { uiCopy } from '$lib/data/ui-copy';

	let { data }: { data: { skill: SkillProfile } } = $props();

	const skill = $derived(data.skill);
	const copy = $derived(uiCopy(lang.current).skillDetail);
	const personal = $derived(getPersonalInfo());
	const related = $derived(
		getSkillProfiles()
			.filter((s) => s.category === skill.category && s.slug !== skill.slug)
			.slice(0, 8)
	);
</script>

<svelte:head>
	<title>{skill.name} — {copy.titleSuffix} | Benito Anagua</title>
	<meta name="description" content={skill.summary} />
</svelte:head>

<PortalLayout>
	<article class="detail">
		<a class="back mono" href="/habilidades">← {copy.back}</a>

		<header>
			<p class="eyebrow mono">{skill.category} / {copy.eyebrow}</p>
			<h1>{skill.name}</h1>
			<p class="summary">{skill.summary}</p>
			{#if skill.narrative}<p class="narrative">{skill.narrative}</p>{/if}
			<ul class="focus-list">
				{#each skill.focusTitles as focus}<li>{focus}</li>{/each}
			</ul>
		</header>

		<section aria-labelledby="evidence-title">
			<div class="section-title">
				<p class="eyebrow mono">{copy.evidenceEyebrow}</p>
				<h2 id="evidence-title">{copy.evidenceTitle}</h2>
			</div>
			<div class="evidence-list">
				{#each skill.evidence as item}
					<article class="evidence-card">
						<div class="meta mono">
							<span>{item.experience.period}</span>
							<span>{item.relevance === 'direct' ? copy.direct : copy.context}</span>
						</div>
						<h3>{item.experience.position}</h3>
						<p class="company">{item.experience.company} · {item.focusTitle}</p>
						<p class="description">{item.experience.description}</p>
					</article>
				{/each}
			</div>
			<p class="note">{copy.note}</p>
		</section>

		<SkillProjects slug={skill.slug} />

		{#if related.length}
			<section aria-labelledby="related-title">
				<h2 id="related-title" class="small-title">{copy.related}</h2>
				<ul class="chips">
					{#each related as item (item.slug)}
						<li><a class="mono" href={`/habilidades/${item.slug}`}>{item.name}</a></li>
					{/each}
				</ul>
			</section>
		{/if}

		<section class="next" aria-labelledby="next-title">
			<h2 id="next-title" class="small-title">{copy.nextTitle}</h2>
			<p>{copy.nextText}</p>
			<div class="actions">
				<a class="btn primary mono" href="/cv">{copy.cv}</a>
				<a class="btn mono" href={`mailto:${personal.email}`}>{copy.contact}</a>
			</div>
		</section>
	</article>
</PortalLayout>

<style>
	.detail {
		max-width: 1000px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.back {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		min-height: 44px;
		font-size: 0.75rem;
		color: var(--color-primary);
		text-decoration: none;
	}
	header {
		padding: clamp(2rem, 6vw, 5rem);
		border: 1px solid var(--color-outline-variant);
		background: var(--color-surface);
	}
	.eyebrow {
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		color: var(--color-primary);
		margin-bottom: 1rem;
	}
	h1 {
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		line-height: 1.02;
		letter-spacing: -0.05em;
		text-transform: none;
	}
	.summary {
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--color-on-surface-variant);
		max-width: 66ch;
		margin-top: 1.5rem;
	}
	.narrative {
		font-size: 0.95rem;
		line-height: 1.8;
		max-width: 66ch;
		margin-top: 1rem;
		padding-left: 1rem;
		border-left: 2px solid var(--color-primary);
	}
	.focus-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
		list-style: none;
	}
	.focus-list li {
		font-size: 0.75rem;
		padding: 0.4rem 0.6rem;
		border: 1px solid var(--color-outline-variant);
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.section-title h2 {
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		text-transform: none;
	}
	.small-title {
		font-size: 1.25rem;
		text-transform: none;
	}
	.evidence-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}
	.evidence-card {
		padding: 1.2rem;
		border: 1px solid var(--color-outline-variant);
		background: var(--color-surface);
	}
	.meta {
		display: flex;
		justify-content: space-between;
		gap: 0.8rem;
		font-size: 0.75rem;
		color: var(--color-primary);
	}
	.evidence-card h3 {
		font-size: 1.1rem;
		text-transform: none;
		margin-top: 1rem;
	}
	.company {
		font-size: 0.8125rem;
		color: var(--color-on-surface-variant);
		margin-top: 0.3rem;
	}
	.description {
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--color-on-surface-variant);
		margin-top: 0.8rem;
		max-width: 66ch;
	}
	.note {
		font-size: 0.8125rem;
		line-height: 1.7;
		color: var(--color-on-surface-variant);
		border-left: 2px solid var(--color-primary);
		padding-left: 1rem;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
	}
	.chips a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 var(--space-3);
		font-size: 0.75rem;
		font-weight: 700;
		text-decoration: none;
		color: var(--color-on-surface-variant);
		border: 1px solid var(--color-outline-variant);
	}
	.chips a:hover {
		color: var(--color-on-surface);
		border-color: var(--color-outline);
	}
	.next {
		padding: clamp(1.5rem, 4vw, 2.5rem);
		border: 1px solid var(--color-outline-variant);
		background: var(--color-surface);
	}
	.next p {
		max-width: 56ch;
		color: var(--color-on-surface-variant);
		line-height: 1.7;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 var(--space-4);
		font-size: 0.75rem;
		font-weight: 700;
		text-decoration: none;
		color: var(--color-on-surface);
		border: 1px solid var(--color-outline);
	}
	.btn.primary {
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-color: var(--color-primary);
	}
	@media (max-width: 700px) {
		.evidence-list {
			grid-template-columns: 1fr;
		}
		.meta {
			flex-direction: column;
		}
	}
</style>
