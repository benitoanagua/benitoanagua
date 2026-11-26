<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
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
	<title>Projects CMS — Admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="admin">
	<header>
		<p class="eyebrow">PORTFOLIO CMS / PROJECTS</p>
		<h1>Projects</h1>
		<p>Manage bilingual project records in D1. Public pages continue using the existing source until the runtime migration is complete.</p>
	</header>

	{#if form?.message}<p class:success={form.success} class:error={!form.success} role="status">{form.message}</p>{/if}

	<div class="workspace">
		<aside>
			<button class="new" type="button" onclick={blank}>＋ New project</button>
			{#each data.projects as item (item.slug)}
				<button class:active={selected === item.slug} class="project-choice" type="button" onclick={() => choose(item.slug)}>
					<strong>{item.slug}</strong>
					<span>{item.is_published ? 'Published' : 'Draft'} · {item.area}</span>
				</button>
			{/each}
		</aside>

		<section class="editor">
			<form method="POST" action="?/save" use:enhance>
				<div class="meta">
					<label>Sort order<input type="number" min="0" name="sort_order" bind:value={order} /></label>
					<label class="check"><input type="checkbox" name="is_published" value="1" bind:checked={published} /> Published</label>
				</div>
				<div class="localized">
					<label>Español · JSON<textarea name="content_es" bind:value={es} spellcheck="false" required></textarea></label>
					<label>English · JSON<textarea name="content_en" bind:value={en} spellcheck="false" required></textarea></label>
				</div>
				<button type="submit">Save project to D1</button>
			</form>
			{#if selected}
				<form method="POST" action="?/delete" use:enhance onsubmit={(event) => { if (!confirm(`Delete project "${selected}" from D1?`)) event.preventDefault(); }}>
					<input type="hidden" name="slug" value={selected} />
					<button class="danger" type="submit">Delete selected project</button>
				</form>
			{/if}
		</section>
	</div>
</main>

<style>
	.admin { max-width: 80rem; margin: 0 auto; padding: clamp(1.25rem, 4vw, 3rem) 1rem 5rem; display: grid; gap: 1.5rem; }
	header { display: grid; gap: .75rem; }
	.eyebrow { font-size: .75rem; letter-spacing: .12em; font-weight: 700; color: var(--color-primary); }
	h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
	header > p:last-child { color: var(--color-on-surface-variant); max-width: 48rem; }
	.workspace { display: grid; grid-template-columns: minmax(13rem, 18rem) minmax(0, 1fr); gap: 1rem; }
	aside { display: flex; flex-direction: column; gap: .5rem; }
	button { min-height: 2.75rem; padding: .6rem .85rem; border: 1px solid var(--color-outline); border-radius: var(--radius-sm); background: transparent; color: var(--color-on-background); font: inherit; font-weight: 700; cursor: pointer; text-align: left; }
	.new { background: var(--color-on-background); color: var(--color-background); }
	.project-choice { display: grid; gap: .25rem; }
	.project-choice span { font-size: .8rem; color: var(--color-on-surface-variant); font-weight: 400; }
	.project-choice.active { border-color: var(--color-primary); background: var(--color-hover-surface); }
	.editor { min-width: 0; border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); padding: clamp(.75rem, 2vw, 1.5rem); display: grid; align-content: start; gap: 1rem; }
	form { display: grid; gap: 1rem; }
	.meta { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
	label { display: grid; gap: .5rem; font-weight: 700; font-size: .875rem; }
	input[type=number] { max-width: 8rem; padding: .5rem; border: 1px solid var(--color-outline); border-radius: var(--radius-sm); background: var(--color-surface-container); color: var(--color-on-background); }
	.check { display: flex; align-items: center; gap: .5rem; }
	.localized { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	textarea { width: 100%; min-height: 55vh; resize: vertical; padding: .75rem; border: 1px solid var(--color-outline); border-radius: var(--radius-sm); background: var(--color-surface-container); color: var(--color-on-background); font: 400 .8rem/1.5 ui-monospace, Consolas, monospace; }
	.danger { color: #b42318; border-color: #b42318; }
	.success { color: #287a42; }
	.error { color: #b42318; }
	@media (max-width: 800px) { .workspace { grid-template-columns: 1fr; } .localized { grid-template-columns: 1fr; } }
</style>
