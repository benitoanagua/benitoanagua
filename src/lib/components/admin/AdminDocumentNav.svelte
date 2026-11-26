<script lang="ts">
	type DocumentKey = 'site' | 'cv' | 'skill_stories';
	let {
		selectedKey,
		selectedLocale,
		baseHref
	}: {
		selectedKey: DocumentKey;
		selectedLocale: 'es' | 'en';
		baseHref: string;
	} = $props();
	const documents: { key: DocumentKey; title: string }[] = [
		{ key: 'site', title: 'Site' },
		{ key: 'cv', title: 'CV' },
		{ key: 'skill_stories', title: 'Skill stories' }
	];
</script>

<nav class="document-nav" aria-label="Select content document">
	{#each documents as document (document.key)}
		<div class="document-group">
			<p class="label">{document.title}</p>
			<div class="locale-links">
				{#each ['es', 'en'] as locale (locale)}
					<a
					class:active={selectedKey === document.key && selectedLocale === locale}
				aria-current={selectedKey === document.key && selectedLocale === locale ? 'page' : undefined}
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				 href={`${baseHref}?key=${document.key}&locale=${locale}`}
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
				>{locale === 'es' ? 'Español' : 'English'}</a>
				{/each}
			</div>
		</div>
	{/each}
</nav>

<style>
	.document-nav {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-5);
		padding-block: var(--space-5);
		border-block: var(--rule-base) solid var(--color-rule-subtle);
	}
	.document-group {
		display: grid;
		align-content: start;
		gap: var(--space-3);
		min-width: 0;
	}
	.document-group .label {
		margin: 0;
		color: var(--color-on-surface-variant);
	}
	.locale-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-4);
	}
	.locale-links a {
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		color: var(--color-on-background);
		text-underline-offset: 0.25em;
	}
	.locale-links a.active {
		font-weight: 700;
		color: var(--color-primary);
		text-decoration-thickness: 2px;
	}
	@media (max-width: 700px) {
		.document-nav { grid-template-columns: 1fr; }
	}
</style>
