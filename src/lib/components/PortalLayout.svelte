<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { loadSiteData } from '$lib/data/site-loader';
	import { getPersonalInfo } from '$lib/data/cv-loader';
	import type { PersonalInfo } from '$lib/types/CV';

	import { lang } from '$lib/state/lang.svelte';
	import { getNavItems } from '$lib/data/nav';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	const navItems = $derived(getNavItems());
	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}

	const site = $derived(loadSiteData(page.data.portfolio));
	const personal = $derived(getPersonalInfo(page.data.portfolio));

	function resolveHref(link: { href_key: string; mailto?: boolean }): string {
		const key = link.href_key as keyof PersonalInfo;
		const value = personal[key] ?? '#';
		return link.mailto ? `mailto:${value}` : String(value);
	}

	let isDark = $state(true);
	$effect(() => {
		const observer = new MutationObserver(() => {
			isDark = document.documentElement.getAttribute('data-theme') === 'dark';
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
		isDark = document.documentElement.getAttribute('data-theme') === 'dark';
		return () => observer.disconnect();
	});

	function toggleTheme() {
		const newTheme = isDark ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	}

	function toggleLang() {
		lang.set(lang.current === 'es' ? 'en' : 'es');
	}
</script>

<div class="portal-wrapper">
	<a class="skip-link label" href="#main">{site.nav.skip_to_content}</a>
	<header class="portal-toolbar">
		<div class="toolbar-inner">
			<a href={resolve('/')} class="toolbar-logo">
				<span class="logo-name">{personal.name.toUpperCase()}</span>
			</a>

			<div class="toolbar-right">
				<nav class="toolbar-nav" aria-label={site.nav.main_aria}>
					{#each navItems as item (item.href)}
						<a
							href={resolve(item.href)}
							class="toolbar-link label"
							class:active={isActive(item.href)}
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					{/each}
				</nav>

				<div class="toolbar-actions">
					<button
						class="tool-btn label"
						onclick={toggleLang}
						aria-label={`${lang.current.toUpperCase()} — ${site.nav.lang_toggle_aria}`}
					>
						{lang.current.toUpperCase()}
					</button>
					<button
						class="tool-btn theme-btn"
						onclick={toggleTheme}
						aria-label={site.nav.theme_toggle_aria}
					>
						<span class="material-symbols-outlined" aria-hidden="true"
							>{isDark ? 'light_mode' : 'dark_mode'}</span
						>
					</button>
				</div>
			</div>
		</div>
	</header>

	<nav class="mobile-nav" aria-label={site.nav.main_aria}>
		{#each navItems as item (item.href)}
			<a href={resolve(item.href)} class="label" class:active={isActive(item.href)}>{item.label}</a>
		{/each}
	</nav>

	<main id="main" class="portal-content" tabindex="-1">
		{@render children?.()}
	</main>

	<footer class="portal-baseboard">
		<div class="baseboard-grid">
			<div class="baseboard-module module--identity">
				<div class="module-header">
					<span class="material-symbols-outlined module-ico" aria-hidden="true">architecture</span>
					<span class="module-name">{personal.name.toUpperCase()}</span>
				</div>
				<p class="module-bio">{site.footer.bio}</p>
				<div class="module-signals">
					{#each site.footer.sections.links.links as link (link.href_key)}
						<a
							href={resolveHref(link)}
							target="_blank"
							rel="noopener external"
							class="signal-link meta"
						>
							<span class="material-symbols-outlined" aria-hidden="true">{link.icon}</span>
							<span class="link-label">{link.label}</span>
						</a>
					{/each}
				</div>
			</div>

			<div class="baseboard-module module--channels">
				<h3 class="module-label kicker">{site.footer.sections.contact.title}</h3>
				<ul class="channel-list">
					{#each site.footer.sections.contact.links as link (link.href_key)}
						<li>
							<a href={resolveHref(link)} rel="external" class="channel-node meta">
								<span class="material-symbols-outlined" aria-hidden="true">{link.icon}</span>
								<span class="label-txt">{link.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="baseboard-lower">
			<div class="lower-inner">
				<span class="legal">© {new Date().getFullYear()} {personal.name}</span>
			</div>
		</div>
	</footer>
</div>

<style>
	.portal-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--color-background);
	}

	.portal-toolbar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: color-mix(in srgb, var(--color-background) 94%, transparent);
		backdrop-filter: blur(12px);
	}

	.toolbar-inner {
		max-width: var(--container-xl);
		margin: 0 auto;
		min-height: 5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-2) var(--space-4);
	}

	.toolbar-logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		color: var(--color-on-background);
	}
	.logo-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.5rem, 1.2rem + 1vw, 1.875rem);
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
	}
	.toolbar-right {
		display: flex;
		align-items: center;
		gap: var(--space-6);
	}
	.toolbar-nav {
		display: none;
		align-items: center;
		gap: var(--space-5);
	}
	@media (min-width: 1024px) {
		.toolbar-nav {
			display: flex;
		}
	}
	.toolbar-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0;
		text-decoration: none;
		color: var(--color-on-surface-variant);
		transition: color var(--duration-fast);
	}
	.toolbar-link:hover,
	.toolbar-link.active {
		color: var(--color-primary);
	}
	.toolbar-link.active::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0.2rem;
		width: 0.3rem;
		height: 0.3rem;
		background: var(--color-primary);
		border-radius: var(--radius-full);
	}
	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	.tool-btn {
		min-width: 2.5rem;
		min-height: 2.5rem;
		padding: 0 var(--space-2);
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--color-on-surface-variant);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			color var(--duration-fast),
			background-color var(--duration-fast);
	}
	.tool-btn:hover {
		color: var(--color-primary);
		background: var(--color-surface-container-low);
	}
	.tool-btn:focus-visible {
		outline: var(--focus-ring);
		outline-offset: var(--focus-offset);
	}
	.theme-btn {
		width: 2.5rem;
		padding: 0;
	}
	.tool-btn .material-symbols-outlined {
		font-size: 1.25rem;
	}

	.portal-content {
		flex: 1;
		width: 100%;
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: var(--space-editorial-sm) var(--space-4);
	}

	.portal-baseboard {
		background: var(--color-background);
		margin-top: var(--space-editorial-xl);
		padding-top: var(--space-editorial-lg);
	}
	.baseboard-grid {
		max-width: var(--container-xl);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-editorial-lg);
		padding: 0 var(--space-4);
	}
	@media (min-width: 768px) {
		.baseboard-grid {
			grid-template-columns: 2fr 1fr;
		}
	}
	.baseboard-module {
		padding: 0;
	}
	.module-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}
	.module-ico {
		color: var(--color-ink-soft);
		font-size: 1.5rem;
	}
	.module-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.25rem;
		letter-spacing: var(--tracking-display);
		color: var(--color-on-background);
	}
	.module-bio {
		font-size: var(--text-body);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
		max-width: 45ch;
		margin-bottom: var(--space-6);
	}
	.module-signals {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3) var(--space-6);
	}
	.signal-link,
	.channel-node {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-on-background);
		text-decoration: none;
		transition: color var(--duration-fast);
	}
	.signal-link:hover,
	.channel-node:hover {
		color: var(--color-primary);
	}
	.signal-link .material-symbols-outlined,
	.channel-node .material-symbols-outlined {
		font-size: 1.125rem;
		color: var(--color-ink-soft);
	}
	.module-label {
		margin-bottom: var(--space-5);
	}
	.channel-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
	}
	.channel-node {
		min-height: 2rem;
	}
	.baseboard-lower {
		max-width: var(--container-xl);
		margin: var(--space-editorial-lg) auto 0;
		padding: 0 var(--space-4);
	}
	.lower-inner {
		padding: var(--space-4) 0;
		border-top: var(--rule-hair) solid var(--color-rule-subtle);
	}
	.legal {
		font-size: var(--text-meta);
		color: var(--color-ink-soft);
	}

	.mobile-nav {
		display: flex;
		scrollbar-width: none;
		mask-image: linear-gradient(to right, #000 calc(100% - 2rem), transparent);
		gap: var(--space-4);
		overflow-x: auto;
		padding: var(--space-2) var(--space-4);
	}
	.mobile-nav a {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		min-height: 2.5rem;
		padding: var(--space-2) 0;
		text-decoration: none;
		color: var(--color-on-surface-variant);
		transition: color var(--duration-fast);
	}
	.mobile-nav a:hover,
	.mobile-nav a.active {
		color: var(--color-primary);
	}
	@media (min-width: 1024px) {
		.mobile-nav {
			display: none;
		}
	}
	.skip-link {
		position: absolute;
		left: var(--space-4);
		top: 0;
		z-index: 200;
		padding: var(--space-3) var(--space-4);
		background: var(--color-primary);
		color: var(--color-on-primary);
		text-decoration: none;
		transform: translateY(-120%);
	}
	.skip-link:focus-visible {
		transform: translateY(0);
	}
</style>
