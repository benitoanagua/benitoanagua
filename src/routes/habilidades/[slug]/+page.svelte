<script lang="ts">
	import { resolve } from '$app/paths';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import SkillProjects from '$lib/components/SkillProjects.svelte';
	import Marginalia from '$lib/design-system/components/Marginalia.svelte';
	import SectionHeading from '$lib/design-system/components/SectionHeading.svelte';
	import Notice from '$lib/design-system/components/Notice.svelte';
	import Pullquote from '$lib/design-system/components/Pullquote.svelte';
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
		<Marginalia>
			{#snippet aside()}
				<div class="mi">
					<span class="meta">{copy.categoryLabel}</span>
					<span class="mi-val">{skill.category}</span>
				</div>
				<div class="mi">
					<span class="meta">{copy.areasLabel}</span>
					<span class="mi-val">{skill.focusTitles.length}</span>
				</div>
				<div class="mi">
					<a class="mi-back" href={resolve('/habilidades')}>← {copy.back}</a>
				</div>
			{/snippet}

			<div class="prose detail-body">
				<p class="kicker">{skill.category} / {copy.eyebrow}</p>
				<h1>{skill.name}</h1>
				<p class="drop-cap summary">{skill.summary}</p>
				{#if skill.narrative}<Pullquote>{skill.narrative}</Pullquote>{/if}
				<ul class="focus-list">
					{#each skill.focusTitles as focus (focus)}<li>{focus}</li>{/each}
				</ul>
			</div>
		</Marginalia>

		<SkillProjects slug={skill.slug} />

		<section aria-labelledby="evidence-title">
			<SectionHeading eyebrow={copy.evidenceEyebrow} title={copy.evidenceTitle} />
			<div class="evidence-list">
				{#each skill.evidence as item (item)}
					<article class="evidence-card">
						<div class="meta-row">
							<span class="meta">{item.experience.period}</span>
							<span class="rel">{item.relevance === 'direct' ? copy.direct : copy.context}</span>
						</div>
						<h3>{item.experience.position}</h3>
						<p class="company">{item.experience.company} · {item.focusTitle}</p>
						<p class="description">{item.experience.description}</p>
					</article>
				{/each}
			</div>
			<Notice tone="note" label={copy.noteLabel}>{copy.note}</Notice>
		</section>

		{#if related.length}
			<section aria-labelledby="related-title">
				<h2 id="related-title" class="related-title">{copy.related}</h2>
				<ul class="chips">
					{#each related as item (item.slug)}
						<li><a href={resolve('/habilidades/[slug]', { slug: item.slug })}>{item.name}</a></li>
					{/each}
				</ul>
			</section>
		{/if}

		<section class="next" aria-labelledby="next-title">
			<div class="rule-thick" aria-hidden="true"></div>
			<h2 id="next-title">{copy.nextTitle}</h2>
			<p>{copy.nextText}</p>
			<div class="actions">
				<a class="btn label primary" href={resolve('/cv')}>{copy.cv}</a>
				<a class="btn label" href={`mailto:${personal.email}`} rel="external">{copy.contact}</a>
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
		gap: var(--space-16);
	}
	.mi {
		display: grid;
		gap: var(--space-1);
	}
	.mi-val {
		font-size: var(--text-meta);
		color: var(--color-on-background);
	}
	.mi-back {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		color: var(--color-primary);
		font-size: var(--text-meta);
		font-weight: 700;
		text-decoration: none;
	}
	.mi-back:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.detail-body {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.detail-body .kicker {
		margin-bottom: var(--space-4);
	}
	.detail-body h1 {
		margin-top: 0;
	}
	.summary {
		margin-top: var(--space-6);
		font-size: var(--text-lead);
		line-height: var(--leading-lead);
	}
	.focus-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-8);
		list-style: none;
	}
	.focus-list li {
		font-size: var(--text-meta);
		padding: 0.35rem 0.6rem;
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
	}
	section {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.evidence-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
	}
	.evidence-card {
		padding: var(--space-6);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container);
	}
	.meta-row {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
	}
	.rel {
		font-size: var(--text-meta);
		color: var(--color-on-surface-variant);
		font-style: italic;
	}
	.evidence-card h3 {
		margin-top: var(--space-4);
		font-size: 1.25rem;
		text-transform: none;
	}
	.company {
		font-size: var(--text-meta);
		color: var(--color-on-surface-variant);
		margin-top: var(--space-1);
	}
	.description {
		font-size: var(--text-meta);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
		margin-top: var(--space-3);
		max-width: 66ch;
	}
	.related-title {
		font-size: var(--text-section);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		list-style: none;
	}
	.chips a {
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
	.chips a:hover {
		color: var(--color-on-background);
		border-color: var(--color-on-background);
	}
	.next {
		padding: var(--space-8) 0 0;
	}
	.next h2 {
		font-size: var(--text-section);
	}
	.next p {
		max-width: var(--measure);
		color: var(--color-on-surface-variant);
		line-height: var(--leading-body);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		min-height: 3rem;
		padding: 0 var(--space-6);
		border: var(--rule-base) solid var(--color-on-background);
		border-radius: var(--radius-sm);
		color: var(--color-on-background);
		text-decoration: none;
	}
	.btn.primary {
		background: var(--color-on-background);
		color: var(--color-background);
	}
	.btn.primary:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
	}
	.btn:hover {
		background: var(--color-surface-container);
	}
	@media (max-width: 700px) {
		.evidence-list {
			grid-template-columns: 1fr;
		}
		.meta-row {
			flex-direction: column;
			gap: var(--space-1);
		}
	}
</style>
