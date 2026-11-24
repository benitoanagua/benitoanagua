<script lang="ts">
	import { resolve } from '$app/paths';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import SectionHeading from '$lib/design-system/components/SectionHeading.svelte';
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
		<header class="intro">
			<p class="eyebrow kicker">{copy.eyebrow}</p>
			<h1>{copy.title}</h1>
			<p class="lead">{copy.intro}</p>
		</header>

		{#each groups as group (group.focus.name)}
			{@const related = skillsFor(group.focus.name)}
			<section class="group" aria-labelledby={`area-${group.focus.name}`}>
				<div class="group-head">
					<SectionHeading eyebrow={copy.area} title={group.focus.title} />
					<span class="meta group-count">{group.experiences.length}</span>
				</div>

				<div class="roles">
					{#each group.experiences as experience (experience)}
						<article class="role">
							<p class="meta role-meta">
								{experience.period} · {experience.company}
							</p>
							<h3>{experience.position}</h3>
							<p class="role-desc">{experience.description}</p>
						</article>
					{/each}
				</div>

				{#if related.length}
					<div class="area-skills">
						<p class="meta">{copy.skillsHere}</p>
						<ul>
							{#each related as skill (skill.slug)}
								<li>
									<a href={resolve('/habilidades/[slug]', { slug: skill.slug })}>{skill.name}</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</section>
		{/each}

		<a class="all-skills label" href={resolve('/habilidades')}>{copy.allSkills} ↗</a>
	</div>
</PortalLayout>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 3.5rem);
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) var(--space-4) var(--space-20);
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
	.group {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.group-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4);
	}
	.group-head :global(.ds-section-heading) {
		flex: 1;
	}
	.group-count {
		padding-top: var(--space-8);
	}
	.roles {
		display: flex;
		flex-direction: column;
	}
	.role {
		padding: var(--space-6) 0;
		border-bottom: var(--rule-hair) solid var(--color-outline-variant);
	}
	.role:first-child {
		border-top: var(--rule-hair) solid var(--color-outline-variant);
	}
	.role-meta {
		margin-bottom: var(--space-2);
	}
	.role h3 {
		font-size: 1.5rem;
		text-transform: none;
	}
	.role-desc {
		max-width: var(--measure);
		font-size: var(--text-meta);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
		margin-top: var(--space-3);
	}
	.area-skills p {
		margin-bottom: var(--space-3);
	}
	.area-skills ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		list-style: none;
	}
	.area-skills a {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 var(--space-4);
		font-size: var(--text-meta);
		font-weight: 700;
		color: var(--color-on-surface-variant);
		border: var(--rule-hair) solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		text-decoration: none;
	}
	.area-skills a:hover {
		color: var(--color-on-background);
		border-color: var(--color-on-background);
	}
	.all-skills {
		align-self: flex-start;
		color: var(--color-primary);
		font-size: var(--text-meta);
		font-weight: 700;
		text-decoration: none;
	}
	.all-skills:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
