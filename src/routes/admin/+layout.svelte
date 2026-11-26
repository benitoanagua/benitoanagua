<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { children, data } = $props();
	const isProjects = $derived(page.url.pathname.startsWith('/admin/proyectos'));
	const contentHref = resolve('/admin') + '?key=site&locale=es';
	const projectsHref = resolve('/admin/proyectos');
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin-shell">
	<header class="topbar">
		<a class="brand" href={contentHref} aria-label="Portfolio admin home">
			<span class="brand-mark" aria-hidden="true">BA</span>
			<span>
				<strong>Portfolio CMS</strong>
				<small>Control panel</small>
			</span>
		</a>
		<div class="session">
			<span class="secure"><span aria-hidden="true">●</span> Access protected</span>
			<span class="identity">{data.adminEmail}</span>
			<a class="logout" href="/cdn-cgi/access/logout">Sign out</a>
		</div>
	</header>

	<div class="admin-body">
		<nav class="sidebar" aria-label="Admin navigation">
			<p class="nav-label">WORKSPACE</p>
			<a class:active={!isProjects} href={contentHref}>
				<span aria-hidden="true">▤</span> Content
			</a>
			<a class:active={isProjects} href={projectsHref}>
				<span aria-hidden="true">▦</span> Projects
			</a>
			<div class="sidebar-note">
				<strong>Protected workspace</strong>
				<p>Changes are saved directly to Cloudflare D1.</p>
			</div>
		</nav>

		<main class="main-content">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.admin-shell {
		min-height: 100vh;
		background: var(--color-background);
		color: var(--color-on-background);
	}
	.topbar {
		min-height: 4.5rem;
		padding: 0.75rem clamp(1rem, 3vw, 2.5rem);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		border-bottom: 1px solid var(--color-outline-variant);
		background: var(--color-surface);
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		color: inherit;
		text-decoration: none;
	}
	.brand-mark {
		width: 2.5rem;
		height: 2.5rem;
		display: grid;
		place-items: center;
		border-radius: var(--radius-sm);
		background: var(--color-on-background);
		color: var(--color-background);
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: -0.04em;
	}
	.brand strong,
	.brand small {
		display: block;
	}
	.brand strong {
		font-size: 0.95rem;
	}
	.brand small {
		margin-top: 0.15rem;
		color: var(--color-on-surface-variant);
		font-size: 0.75rem;
	}
	.session {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.8rem;
	}
	.secure {
		color: var(--color-on-surface-variant);
		white-space: nowrap;
	}
	.secure span {
		color: #2f9e62;
		font-size: 0.65rem;
		margin-right: 0.25rem;
	}
	.identity {
		max-width: 16rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--color-on-surface-variant);
	}
	.logout {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		color: inherit;
		text-decoration: none;
		font-weight: 700;
		white-space: nowrap;
	}
	.admin-body {
		max-width: 100rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 14rem minmax(0, 1fr);
		gap: clamp(1rem, 2.5vw, 2rem);
		padding: clamp(1rem, 2.5vw, 2rem);
	}
	.sidebar {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.35rem;
		padding-top: 0.5rem;
	}
	.nav-label {
		margin: 0 0 0.75rem 0.75rem;
		color: var(--color-on-surface-variant);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.12em;
	}
	.sidebar > a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		color: var(--color-on-surface-variant);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 650;
	}
	.sidebar > a span {
		width: 1.25rem;
		text-align: center;
		font-size: 1rem;
	}
	.sidebar > a:hover {
		background: var(--color-hover-surface);
		color: var(--color-on-background);
	}
	.sidebar > a.active {
		border-color: var(--color-outline-variant);
		background: var(--color-surface-container);
		color: var(--color-on-background);
	}
	.sidebar-note {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid var(--color-outline-variant);
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
	}
	.sidebar-note strong {
		font-size: 0.82rem;
	}
	.sidebar-note p {
		margin-top: 0.5rem;
		color: var(--color-on-surface-variant);
		line-height: 1.5;
	}
	.main-content {
		min-width: 0;
	}
	@media (max-width: 760px) {
		.topbar {
			align-items: flex-start;
			flex-direction: column;
		}
		.session {
			width: 100%;
			flex-wrap: wrap;
			gap: 0.6rem;
		}
		.identity {
			flex: 1 1 10rem;
		}
		.admin-body {
			grid-template-columns: minmax(0, 1fr);
		}
		.sidebar {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.nav-label,
		.sidebar-note {
			grid-column: 1 / -1;
		}
		.sidebar-note {
			margin-top: 0.75rem;
		}
	}
</style>
