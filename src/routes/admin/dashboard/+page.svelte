<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import AdminMetric from '$lib/components/admin/AdminMetric.svelte';
	import AdminQuickLink from '$lib/components/admin/AdminQuickLink.svelte';
	import AdminStatus from '$lib/components/admin/AdminStatus.svelte';

	let { data }: { data: PageData } = $props();
	const contentHref = resolve('/admin') + '?key=site&locale=es';
	const projectsHref = resolve('/admin/proyectos');
	const formatDate = (value: string | null) =>
		value
			? new Date(value.replace(' ', 'T') + (value.includes('Z') ? '' : 'Z')).toLocaleString()
			: 'Sin registro';
</script>

<svelte:head>
	<title>Portfolio CMS — Resumen</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="dashboard">
	<AdminPageHeader
		kicker="ADMINISTRACIÓN · RESUMEN"
		title="Dashboard"
		description="Estado del contenido que alimenta el portfolio. Los cambios publicados se sirven desde Cloudflare D1."
	/>

	<AdminStatus
		label="Base de datos"
		detail="D1 disponible · consultas de lectura completadas"
		tone="success"
	/>

	<section class="metrics" aria-label="Resumen de contenido">
		<AdminMetric
			label="Documentos localizados"
			value={data.contentCount}
			detail="Registros de contenido en español e inglés"
		/>
		<AdminMetric
			label="Proyectos"
			value={data.projectCount}
			detail="Todos los registros guardados"
		/>
		<AdminMetric
			label="Proyectos publicados"
			value={data.publishedProjectCount}
			detail="Visibles en el portfolio público"
		/>
	</section>

	<section class="quick-actions" aria-labelledby="actions-title">
		<h2 id="actions-title">Administrar contenido</h2>
		<div class="quick-links">
			<AdminQuickLink
				title="Editor de contenido"
				description="Actualiza los documentos del sitio, CV e historias de habilidades en ambos idiomas."
				href={contentHref}
			/>
			<AdminQuickLink
				title="Proyectos"
				description="Crea, edita, publica o retira fichas de proyectos."
				href={projectsHref}
			/>
		</div>
	</section>

	<section class="recent" aria-labelledby="recent-title">
		<h2 id="recent-title">Registros recientes</h2>
		<div class="recent-columns">
			<div>
				<h3>Contenido</h3>
				{#if data.recentContent.length}
					<ul>
						{#each data.recentContent as item (item.content_key + ':' + item.locale)}
							<li>
								<a href={resolve('/admin') + '?key=' + item.content_key + '&locale=' + item.locale}
									>{item.content_key} · {item.locale}</a
								><span>{formatDate(item.updated_at)}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p>No hay documentos registrados.</p>
				{/if}
			</div>
			<div>
				<h3>Proyectos</h3>
				{#if data.recentProjects.length}
					<ul>
						{#each data.recentProjects as item (item.slug)}
							<li>
								<a href={resolve('/admin/proyectos')}>{item.slug}</a>
								<p>{formatDate(item.updated_at)}</p>
							</li>
						{/each}
					</ul>
				{:else}
					<p>No hay proyectos registrados.</p>
				{/if}
			</div>
		</div>
	</section>
</section>

<style>
	.dashboard {
		display: grid;
		gap: var(--space-editorial-md);
	}
	.metrics {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-6);
	}
	.quick-actions,
	.recent {
		padding-top: var(--space-6);
		border-top: var(--rule-base) solid var(--color-on-background);
	}
	.quick-actions h2,
	.recent h2 {
		margin: 0 0 var(--space-5);
		font-family: var(--font-display);
		font-size: var(--text-section);
	}
	.quick-links {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-6);
	}
	.recent-columns {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-8);
	}
	.recent-columns h3 {
		margin: 0 0 var(--space-4);
	}
	.recent-columns ul {
		list-style: none;
	}
	.recent-columns li {
		display: grid;
		gap: var(--space-1);
		padding-block: var(--space-3);
		border-bottom: var(--rule-base) solid var(--color-rule-subtle);
	}
	.recent-columns li a {
		overflow-wrap: anywhere;
	}
	.recent-columns li p {
		color: var(--color-on-surface-variant);
	}
	.recent-columns p {
		color: var(--color-on-surface-variant);
	}
	@media (max-width: 850px) {
		.metrics {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}
		.quick-links,
		.recent-columns {
			grid-template-columns: 1fr;
		}
	}
</style>
