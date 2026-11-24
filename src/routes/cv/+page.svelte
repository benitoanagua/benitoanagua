<script lang="ts">
	import PortalLayout from '$lib/components/PortalLayout.svelte';
	import { lang } from '$lib/state/lang.svelte';


	const files = [
		{ label: 'Analista de Aplicaciones de Negocio', file: 'BenitoAnagua_AnalistaAplicaciones_2026_ES.pdf' },
		{ label: 'Docente de Diseño Digital', file: 'BenitoAnagua_DocenteDiseno_2026_ES.pdf' },
		{ label: 'Senior Full Stack Developer', file: 'BenitoAnagua_FullStackSenior_2026_ES.pdf' },
		{ label: 'Product Designer', file: 'BenitoAnagua_ProductDesigner_2026_ES.pdf' }
	];

	const copy = $derived(
		lang.current === 'en'
			? {
				 title: 'CV and professional documents',
				 intro: 'Download the current professional documents or explore the skills and experience behind them.',
				 download: 'Download PDF',
				 explore: 'Explore skills'
			 }
			: {
				 title: 'CV y documentos profesionales',
				 intro: 'Descarga los documentos profesionales vigentes o explora las habilidades y experiencia que los respaldan.',
				 download: 'Descargar PDF',
				 explore: 'Explorar habilidades'
			 }
	);
</script>

<svelte:head>
	<title>{copy.title} — Benito Anagua</title>
	<meta name="description" content={copy.intro} />
</svelte:head>

<PortalLayout>
	<div class="cv-page">
		<header>
			<p class="eyebrow mono">DOCUMENTS / CURRENT CV</p>
			<h1>{copy.title}</h1>
			<p>{copy.intro}</p>
			<a class="primary" href="/habilidades">{copy.explore} ↗</a>
		</header>
		<section>
			<h2>{lang.current === 'en' ? 'Current PDF documents' : 'Documentos PDF vigentes'}</h2>
			<div class="documents">
				{#each files as file}
					<a class="document" href={'/cv/' + file.file} download>
						<span class="mono">ES · 2026 / PDF</span>
						<h3>{file.label}</h3>
						<span class="download">{copy.download} ↓</span>
					</a>
				{/each}
			</div>
		</section>
	</div>
</PortalLayout>

<style>
	.cv-page { display: flex; flex-direction: column; gap: 3rem; }
	header { padding: clamp(2rem, 6vw, 5rem); border: 1px solid var(--color-outline-variant); background: var(--color-surface); }
	.eyebrow { font-size: .65rem; letter-spacing: .14em; color: var(--color-primary); margin-bottom: 1rem; }
	h1 { font-size: clamp(2.3rem, 6vw, 5rem); line-height: 1.04; letter-spacing: -.045em; text-transform: none; }
	header > p:not(.eyebrow) { max-width: 680px; color: var(--color-on-surface-variant); line-height: 1.75; margin-top: 1.5rem; }
	.primary { display: inline-block; margin-top: 1.5rem; background: var(--color-primary); color: var(--color-on-primary); padding: .8rem 1rem; text-decoration: none; font-size: .75rem; font-weight: 700; }
	section { display: flex; flex-direction: column; gap: 1rem; }
	section h2 { font-size: 1.5rem; text-transform: none; }
	.documents { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
	.document { display: flex; flex-direction: column; padding: 1.2rem; border: 1px solid var(--color-outline-variant); background: var(--color-surface); text-decoration: none; color: inherit; }
	.document .mono { font-size: .62rem; color: var(--color-primary); letter-spacing: .08em; }
	.document h3 { font-size: 1rem; text-transform: none; margin-top: 1rem; }
	.download { font-size: .68rem; color: var(--color-primary); margin-top: auto; padding-top: 1.4rem; }
	@media (max-width: 600px) { .documents { grid-template-columns: 1fr; } }
</style>
