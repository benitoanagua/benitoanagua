<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import AdminStatus from '$lib/components/admin/AdminStatus.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let selected = $state(data.projects[0]?.slug ?? '');
	let es = $state(data.projects[0] ? JSON.stringify(JSON.parse(data.projects[0].content_es), null, 2) : '');
	let en = $state(data.projects[0] ? JSON.stringify(JSON.parse(data.projects[0].content_en), null, 2) : '');
	let order = $state(data.projects[0]?.sort_order ?? 0);
	let published = $state(data.projects[0]?.is_published === 1);
	function choose(slug: string) {
		selected = slug;
		const item = data.projects.find((p) => p.slug === slug);
		es = item ? JSON.stringify(JSON.parse(item.content_es), null, 2) : '';
		en = item ? JSON.stringify(JSON.parse(item.content_en), null, 2) : '';
		order = item?.sort_order ?? data.projects.length;
		published = item?.is_published === 1;
	}
	function blank() {
		selected = '';
		es = JSON.stringify({ slug: '', title: '', area: 'dev', year: '', role: '', summary: '', stack: [], skills: [], highlights: [] }, null, 2);
		en = es;
		order = data.projects.length;
		published = false;
	}
</script>

<svelte:head>
	<title>Portfolio CMS — Proyectos</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="projects-admin">
	<AdminPageHeader
		kicker="ADMINISTRACIÓN · PROYECTOS"
		title="Proyectos"
		description="Gestiona las fichas bilingües almacenadas en D1. Solo los proyectos publicados aparecen en el portfolio."
	/>

	{#if form?.message}
		<AdminStatus label={form.success ? 'Operación completada' : 'La operación no se completó'} detail={form.message} tone={form.success ? 'success' : 'error'} />
	{/if}

	<div class="project-workspace">
		<aside class="project-list" aria-label="Listado de proyectos">
			<button class="new" type="button" onclick={blank}>Crear proyecto</button>
			<p class="label">Registros ({data.projects.length})</p>
			{#each data.projects as item (item.slug)}
				<button class="project-choice" class:active={selected === item.slug} type="button" onclick={() => choose(item.slug)}>
					<strong>{item.slug}</strong>
					<span>{item.is_published ? 'Publicado' : 'Borrador'} · {item.area}</span>
				</button>
			{/each}
		</aside>

		<section class="editor" aria-label="Editor de proyecto">
			<form method="POST" action="?/save" use:enhance>
				<div class="meta">
					<label>Orden de publicación<input type="number" min="0" name="sort_order" bind:value={order} /></label>
					<label class="check"><input type="checkbox" name="is_published" value="1" bind:checked={published} /> Publicado</label>
				</div>
				<div class="localized">
					<label>Contenido en español<textarea name="content_es" bind:value={es} spellcheck="false" required></textarea></label>
					<label>Contenido en inglés<textarea name="content_en" bind:value={en} spellcheck="false" required></textarea></label>
				</div>
				<button class="save" type="submit">Guardar proyecto</button>
			</form>
			{#if selected}
				<form method="POST" action="?/delete" use:enhance onsubmit={(event) => { if (!confirm(`¿Eliminar el proyecto "${selected}" de D1?`)) event.preventDefault(); }}>
					<input type="hidden" name="slug" value={selected} />
					<button class="danger" type="submit">Eliminar proyecto seleccionado</button>
				</form>
			{/if}
		</section>
	</div>
</section>

<style>
	.projects-admin { display: grid; gap: var(--space-editorial-md); }
	.project-workspace {
		display: grid;
		grid-template-columns: minmax(14rem, 19rem) minmax(0, 1fr);
		gap: clamp(1.5rem, 4vw, 3rem);
	}
	.project-list { display: grid; align-content: start; gap: var(--space-3); }
	.project-list > .label { margin: var(--space-3) 0 0; color: var(--color-on-surface-variant); }
	button {
		min-height: 3rem;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-on-background);
		font: 700 1rem/1.4 var(--font-ui);
		text-align: left;
		cursor: pointer;
	}
	button:hover { background: var(--color-hover-surface); }
	.new, .save {
		border-color: var(--color-primary);
		background: var(--color-primary);
		color: var(--color-on-primary);
	}
	.project-choice { display: grid; gap: var(--space-2); }
	.project-choice span { color: var(--color-on-surface-variant); font-weight: 400; }
	.project-choice.active { border-left: 3px solid var(--color-primary); background: var(--color-surface-container-low); }
	.editor { min-width: 0; padding-top: var(--space-5); border-top: var(--rule-base) solid var(--color-on-background); }
	.editor form { display: grid; gap: var(--space-5); }
	.meta { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-5); }
	label { display: grid; gap: var(--space-2); font-weight: 700; }
	input[type='number'] {
		min-height: 3rem;
		max-width: 10rem;
		padding: var(--space-3);
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container-low);
		color: var(--color-on-background);
		font: 1rem var(--font-ui);
	}
	.check { display: flex; align-items: center; gap: var(--space-3); }
	.check input { width: 1.25rem; height: 1.25rem; }
	.localized { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-5); }
	textarea {
		width: 100%;
		min-height: 55vh;
		resize: vertical;
		padding: var(--space-4);
		border: 1px solid var(--color-outline);
		border-radius: var(--radius-sm);
		background: var(--color-surface-container-low);
		color: var(--color-on-background);
		font: 1rem/1.6 var(--font-mono);
	}
	.danger { border-width: var(--rule-thick); border-color: var(--color-error); color: var(--color-error); }
	@media (max-width: 850px) {
		.project-workspace, .localized { grid-template-columns: 1fr; }
	}
</style>
