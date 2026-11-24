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

	// Navegación única (src/lib/data/nav.ts)
	const navItems = $derived(getNavItems());
	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}

	// Datos reactivos al idioma (contenido del portafolio vía layout data)
	const site = $derived(loadSiteData(page.data.portfolio));
	const personal = $derived(getPersonalInfo(page.data.portfolio));

	// Resuelve la URL de un link del footer usando href_key → PersonalInfo
	function resolveHref(link: { href_key: string; mailto?: boolean }): string {
		const key = link.href_key as keyof PersonalInfo;
		const value = personal[key] ?? '#';
		return link.mailto ? `mailto:${value}` : String(value);
	}

	// Lee el tema del DOM y lo observa para mantener el ícono sincronizado
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
	<!-- ══ PORTAL HEADER ══ -->
	<header class="portal-toolbar">
		<div class="rule-double toolbar-double" aria-hidden="true"></div>
		<div class="toolbar-inner">
			<a href={resolve('/')} class="toolbar-logo">
				<span class="logo-name">{personal.name.toUpperCase()}</span>
			</a>

			<div class="toolbar-right">
				<span class="logo-tagline meta">{site.meta.tagline}</span>

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
						aria-label={site.nav.lang_toggle_aria}
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
		<div class="rule-hair toolbar-hair" aria-hidden="true"></div>
	</header>

	<nav class="mobile-nav" aria-label={site.nav.main_aria}>
		{#each navItems as item (item.href)}
			<a href={resolve(item.href)} class="label" class:active={isActive(item.href)}>{item.label}</a>
		{/each}
	</nav>

	<main id="main" class="portal-content" tabindex="-1">
		{@render children?.()}
	</main>

	<!-- ══ PORTAL FOOTER ══ -->
	<footer class="portal-baseboard">
		<div class="rule-thick" aria-hidden="true"></div>
		<div class="baseboard-grid">
			<!-- Identity Node -->
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

			<!-- Communication Channels -->
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
			<div class="rule-soft" aria-hidden="true"></div>
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

	/* ── TOOLBAR ── */
	.portal-toolbar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--color-background);
	}

	.toolbar-double {
		max-width: var(--container-xl);
		margin: 0 auto;
	}
	.toolbar-hair {
		max-width: var(--container-xl);
		margin: 0 auto;
	}

	.toolbar-inner {
		max-width: var(--container-xl);
		margin: 0 auto;
		min-height: 4rem;
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
		letter-spacing: 0.04em;
		line-height: 1.1;
	}

	.toolbar-right {
		display: flex;
		align-items: center;
		gap: var(--space-6);
	}

	.logo-tagline {
		display: none;
		max-width: 22rem;
	}
	@media (min-width: 768px) {
		.logo-tagline {
			display: block;
		}
	}

	.toolbar-nav {
		display: none;
		align-items: center;
		gap: var(--space-2);
	}
	@media (min-width: 1024px) {
		.toolbar-nav {
			display: flex;
		}
	}

	.toolbar-link {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 var(--space-2);
		text-decoration: none;
		color: var(--color-on-surface-variant);
		border-bottom: var(--rule-thick) solid transparent;
	}
	.toolbar-link:hover {
		color: var(--color-on-background);
	}
	.toolbar-link.active {
		color: var(--color-on-background);
		border-bottom-color: var(--color-primary);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.tool-btn {
		min-width: 2.75rem;
		min-height: 2.75rem;
		padding: 0 var(--space-3);
		border: var(--rule-base) solid var(--color-on-background);
		border-radius: 0;
		background: transparent;
		color: var(--color-on-background);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color var(--duration-fast),
			color var(--duration-fast),
			border-color var(--duration-fast);
	}
	.tool-btn:hover {
		background: var(--color-surface-container);
	}
	.theme-btn {
		padding: 0;
		width: 2.75rem;
	}
	.tool-btn .material-symbols-outlined {
		font-size: 1.25rem;
	}

	/* ── MAIN CONTENT ── */
	.portal-content {
		flex: 1;
		width: 100%;
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: var(--space-6) var(--space-4);
	}

	/* ── BASEBOARD (Footer) ── */
	.portal-baseboard {
		background: var(--color-background);
		margin-top: var(--space-16);
	}

	.baseboard-grid {
		max-width: var(--container-xl);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr;
	}

	@media (min-width: 768px) {
		.baseboard-grid {
			grid-template-columns: 2fr 1fr;
		}
		.module--channels {
			border-left: var(--rule-hair) solid var(--color-on-background);
		}
	}

	.baseboard-module {
		padding: var(--space-12) var(--space-6);
	}

	.module--identity {
		border-bottom: var(--rule-hair) solid var(--color-on-background);
	}

	@media (min-width: 768px) {
		.module--identity {
			border-bottom: none;
		}
	}

	.module-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.module-ico {
		color: var(--color-on-background);
		font-size: 1.5rem;
	}

	.module-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.25rem;
		letter-spacing: 0.04em;
		color: var(--color-on-background);
	}

	.module-bio {
		font-size: var(--text-body);
		line-height: var(--leading-body);
		color: var(--color-on-surface-variant);
		max-width: 45ch;
		margin-bottom: var(--space-8);
	}

	.module-signals {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	@media (min-width: 640px) {
		.module-signals {
			flex-direction: row;
			gap: var(--space-6);
		}
	}

	.signal-link,
	.channel-node {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-on-background);
	}
	.signal-link:hover,
	.channel-node:hover {
		color: var(--color-primary);
	}
	.signal-link .material-symbols-outlined,
	.channel-node .material-symbols-outlined {
		font-size: 1.125rem;
		color: var(--color-on-surface-variant);
	}

	.module-label {
		margin-bottom: var(--space-6);
	}

	.channel-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.channel-node {
		min-height: 2.75rem;
	}

	.baseboard-lower {
		background: var(--color-background);
	}

	.lower-inner {
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: var(--space-4) var(--space-6);
	}

	.legal {
		font-size: var(--text-meta);
		color: var(--color-ink-soft);
	}

	/* ── NAV MÓVIL: la barra superior solo muestra el menú en escritorio ── */
	.mobile-nav {
		display: flex;
		scrollbar-width: none;
		/* design-allow: R4 mask — degradado de borde, no un color de interfaz */
		mask-image: linear-gradient(to right, #000 calc(100% - 2rem), transparent);
		gap: var(--space-1);
		overflow-x: auto;
		padding: var(--space-2) var(--space-4);
		border-bottom: var(--rule-hair) solid var(--color-on-background);
	}
	.mobile-nav a {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: var(--space-2) var(--space-3);
		text-decoration: none;
		color: var(--color-on-surface-variant);
		border-bottom: var(--rule-thick) solid transparent;
	}
	.mobile-nav a.active {
		color: var(--color-on-background);
		border-bottom-color: var(--color-primary);
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
