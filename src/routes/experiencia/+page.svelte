<script lang="ts">
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import { getExperienceGroups, getSkillProfiles } from '$lib/data/skill-profiles';
	import { uiCopy } from '$lib/data/ui-copy';
	import { lang } from '$lib/state/lang.svelte';

	const copy = $derived(uiCopy(lang.current).experience);
	const groups = $derived(getExperienceGroups());
	const skills = $derived(getSkillProfiles());
	const skillsFor = (focusName: string) =>
		skills.filter((s) => s.focusNames.includes(focusName)).slice(0, 8);
</script>

<svelte:head>
	<title>{copy.pageTitle} — Benito Anagua</title>
	<meta name="description" content={copy.intro} />
</svelte:head>

<PortalLayout>
	<div class="page">
		<header>
			<p class="eyebrow mono">{copy.eyebrow}</p>
			<h1>{copy.title}</h1>
			<p class="lead">{copy.intro}</p>
		</header>

		{#each groups as group}
			{@const related = skillsFor(group.focus.name)}
			<section aria-labelledby={`area-${group.focus.name}`}>
				<div class="group-head">
					<div>
						<p class="eyebrow mono">{copy.area}</p>
						<h2 id={`area-${group.focus.name}`}>{group.focus.title}</h2>
					</div>
					<span class="mono">{group.experiences.length}</span>
				</div>

				{#each group.experiences as experience}
					<article class="role">
						<div class="meta mono">
							<span>{experience.period}</span>
							<span>{experience.company}</span>
						</div>
						<h3>{experience.position}</h3>
						<p>{experience.description}</p>
					</article>
				{/each}

				{#if related.length}
					<div class="area-skills">
						<p class="mono">{copy.skillsHere}</p>
						<ul>
							{#each related as skill (skill.slug)}
								<li><a class="mono" href={`/habilidades/${skill.slug}`}>{skill.name}</a></li>
							{/each}
						</ul>
					</div>
				{/if}
			</section>
		{/each}

		<a class="all-skills mono" href="/habilidades">{copy.allSkills} ↗</a>
	</div>
</PortalLayout>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}
	header {
		padding: clamp(2rem, 6vw, 5rem);
		background: var(--color-surface);
		border: 1px solid var(--color-outline-variant);
	}
	.eyebrow {
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		color: var(--color-primary);
		margin-bottom: 1rem;
	}
	h1 {
		font-size: clamp(2.3rem, 6vw, 5rem);
		line-height: 1.04;
		letter-spacing: -0.045em;
		max-width: 950px;
		text-transform: none;
	}
	.lead {
		max-width: 62ch;
		color: var(--color-on-surface-variant);
		line-height: 1.75;
		margin-top: 1.5rem;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.group-head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		border-bottom: 1px solid var(--color-outline-variant);
		padding-bottom: 1rem;
		margin-bottom: 0.4rem;
	}
	.group-head .eyebrow {
		margin-bottom: 0.4rem;
	}
	.group-head h2 {
		font-size: clamp(1.3rem, 3vw, 2rem);
		text-transform: none;
	}
	.group-head > span {
		font-size: 0.75rem;
		color: var(--color-primary);
	}
	.role {
		padding: 1.25rem;
		border: 1px solid var(--color-outline-variant);
		background: var(--color-surface);
	}
	.meta {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.75rem;
		color: var(--color-primary);
	}
	.role h3 {
		font-size: 1.1rem;
		text-transform: none;
		margin-top: 0.9rem;
	}
	.role p {
		font-size: 0.9rem;
		line-height: 1.75;
		color: var(--color-on-surface-variant);
		margin-top: 0.7rem;
		max-width: 70ch;
	}
	.area-skills p {
		font-size: 0.75rem;
		color: var(--color-on-surface-variant);
		margin-bottom: 0.4rem;
	}
	.area-skills ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
	}
	.area-skills a {
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
	.area-skills a:hover {
		color: var(--color-on-surface);
		border-color: var(--color-outline);
	}
	.all-skills {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-primary);
		text-decoration: none;
	}
	@media (max-width: 600px) {
		.meta {
			flex-direction: column;
			gap: 0.3rem;
		}
	}
</style>
