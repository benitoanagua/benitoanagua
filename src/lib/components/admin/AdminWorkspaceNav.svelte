<script lang="ts">
	let {
		active = 'content',
		adminEmail
	}: {
		active?: 'content' | 'projects';
		adminEmail: string;
	} = $props();
</script>

<header class="workspace-header">
	<a class="wordmark" href="/admin?key=site&locale=es">Portfolio <span>CMS</span></a>
	<div class="identity">
		<p class="label">Signed in as</p>
		<p class="email">{adminEmail}</p>
		<a class="logout" href="/cdn-cgi/access/logout">Sign out of Cloudflare Access</a>
	</div>
</header>

<div class="workspace-navigation">
	<nav aria-label="Admin workspace">
		<a class:active={active === 'content'} aria-current={active === 'content' ? 'page' : undefined} href="/admin?key=site&locale=es">Content editor</a>
		<a class:active={active === 'projects'} aria-current={active === 'projects' ? 'page' : undefined} href="/admin/proyectos">Projects</a>
	</nav>
	<p class="access-note">Private workspace · Cloudflare Access protected</p>
</div>

<style>
	.workspace-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-6);
		padding: var(--space-6) clamp(1rem, 4vw, 3rem);
		border-bottom: var(--rule-base) solid var(--color-on-background);
	}
	.wordmark {
		font-family: var(--font-display);
		font-size: var(--text-section);
		font-weight: 700;
		color: var(--color-on-background);
		text-decoration: none;
	}
	.wordmark span { color: var(--color-primary); }
	.identity {
		display: grid;
		gap: var(--space-1);
		text-align: right;
	}
	.identity .label { margin: 0; color: var(--color-on-surface-variant); }
	.email {
		margin: 0;
		max-width: 35ch;
		overflow-wrap: anywhere;
		font-size: var(--text-meta);
	}
	.logout {
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		color: var(--color-on-surface-variant);
		text-underline-offset: 0.25em;
	}
	.workspace-navigation {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: 0 clamp(1rem, 4vw, 3rem);
		border-bottom: var(--rule-base) solid var(--color-rule-subtle);
	}
	.workspace-navigation nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-5);
	}
	.workspace-navigation nav a {
		min-height: 3.25rem;
		display: inline-flex;
		align-items: center;
		border-bottom: 2px solid transparent;
		color: var(--color-on-surface-variant);
		text-decoration: none;
		font-size: var(--text-meta);
	}
	.workspace-navigation nav a.active {
		border-bottom-color: var(--color-primary);
		color: var(--color-on-background);
		font-weight: 700;
	}
	.access-note {
		margin: 0;
		color: var(--color-on-surface-variant);
		font-size: var(--text-meta);
	}
	@media (max-width: 760px) {
		.workspace-header { flex-direction: column; }
		.identity { text-align: left; }
		.logout { justify-content: flex-start; }
		.workspace-navigation { align-items: flex-start; flex-direction: column; padding-block: var(--space-3); }
	}
</style>
