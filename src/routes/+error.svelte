<script lang="ts">
	import { page } from '$app/state';
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
		<p class="code mono">{page.status}</p>
		<h1>{notFound ? copy.notFoundTitle : copy.genericTitle}</h1>
		<p class="text">{notFound ? copy.notFoundText : copy.genericText}</p>
		<ul>
			<li><a class="primary mono" href="/">{copy.home}</a></li>
			{#each links as item}
				<li><a class="mono" href={item.href}>{item.label}</a></li>
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
		gap: 1.25rem;
	}
	.code {
		font-size: 0.75rem;
		color: var(--color-primary);
	}
	h1 {
		font-size: clamp(2rem, 6vw, 3.5rem);
		line-height: 1.05;
		letter-spacing: -0.04em;
		text-transform: none;
	}
	.text {
		color: var(--color-on-surface-variant);
		line-height: 1.7;
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
	}
	a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 var(--space-4);
		font-size: 0.75rem;
		font-weight: 700;
		text-decoration: none;
		color: var(--color-on-surface);
		border: 1px solid var(--color-outline-variant);
	}
	a:hover {
		border-color: var(--color-outline);
	}
	.primary {
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-color: var(--color-primary);
	}
</style>
