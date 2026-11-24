<script lang="ts">
let{eyebrow,title,description,align='left'}:{eyebrow?:string;title:string;description?:string;align?:'left'|'center'}=$props();
</script>
<header class="section-heading" class:center={align==='center'}>{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}<h2>{title}</h2>{#if description}<p class="description">{description}</p>{/if}</header>
<style>
.section-heading{max-width:48rem;margin-bottom:2rem;color:var(--ds-text)}.center{text-align:center;margin-inline:auto}.eyebrow{margin:0 0 .75rem;color:var(--ds-muted);font:.7rem var(--ds-font);letter-spacing:.12em;text-transform:uppercase}.section-heading h2{margin:0;font:400 clamp(2rem,5vw,3.5rem)/1.05 var(--font-display, var(--ds-font));letter-spacing:-.035em}.description{max-width:40rem;margin:1rem 0 0;color:var(--ds-muted);font-size:1rem;line-height:1.65}.center .description{margin-inline:auto}
</style>