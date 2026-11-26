<script lang="ts">
	import AdminWorkspaceNav from '$lib/components/admin/AdminWorkspaceNav.svelte';
	let { children, data } = $props();
	const active = $derived(data.activeSection ?? 'content');
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin-shell">
	<AdminWorkspaceNav {active} adminEmail={data.adminEmail} />
	<main class="admin-main">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		min-height: 100vh;
		background: var(--color-background);
		color: var(--color-on-background);
	}
	.admin-main {
		max-width: 100rem;
		margin-inline: auto;
		padding: clamp(1.25rem, 4vw, 3rem) clamp(1rem, 4vw, 3rem) var(--space-editorial-xl);
	}
</style>
