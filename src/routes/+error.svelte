<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import { getNavItems } from '$lib/data/nav';
	import { uiCopy } from '$lib/data/ui-copy';
	import { lang } from '$lib/state/lang.svelte';

	const copy = $derived(uiCopy(lang.current).error);
	const notFound = $derived(page.status === 404);
	const links = $derived(getNavItems());
</script>

<svelte:head>
	<title>{notFound ? copy.notFoundTitle : copy.genericTitle} — Benito Anagua</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PortalLayout>
	<section class="error">
		<p class="code kicker">{page.status}</p>
		<h1>{notFound ? copy.notFoundTitle : copy.genericTitle}</h1>
		<div class="prose">
			<p>{notFound ? copy.notFoundText : copy.genericText}</p>
		</div>
		<ul class="error-links">
			<li><a class="home label" href={resolve('/')}>{copy.home}</a></li>
			{#each links as item (item.href)}
				<li><a href={resolve(item.href)}>{item.label}</a></li>
			{/each}
		</ul>
	</section>
</PortalLayout>

<style>
	.error {
		max-width: 44rem;
		margin: 0 auto;
		padding: clamp(2rem, 6vw, 4rem) var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	.code {
		margin-bottom: calc(-1 * var(--space-4));
	}
	.prose {
		color: var(--color-on-surface-variant);
	}
	.error-links {
		display: flex;
		flex-direction: column;
		list-style: none;
	}
	.error-links a {
		display: flex;
		align-items: center;
		min-height: 2.75rem;
		padding: var(--space-2) 0;
		color: var(--color-on-background);
		font-size: var(--text-meta);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.error-links li + li a {
		border-top: var(--rule-hair) dashed var(--color-outline-variant);
	}
	.error-links .home {
		color: var(--color-primary);
	}
</style>
