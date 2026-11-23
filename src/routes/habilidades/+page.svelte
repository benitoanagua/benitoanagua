<script lang="ts">
 import PortalLayout from '$lib/components/PortalLayout.svelte';
 import { getSkillProfiles, getSkillCategories } from '$lib/data/skill-profiles';
 import { lang } from '$lib/state/lang.svelte';
 const skills = $derived(getSkillProfiles());
 const categories = $derived(getSkillCategories());
 const navItems = $derived(lang.current === 'en'
  ? [{label:'Skills',href:'/habilidades'},{label:'Experience',href:'/experiencia'},{label:'CV',href:'/cv'}]
  : [{label:'Habilidades',href:'/habilidades'},{label:'Experiencia',href:'/experiencia'},{label:'CV',href:'/cv'}]);
 const copy = $derived(lang.current === 'en'
  ? {title:'Skills, connected to experience.',intro:'Explore each capability through the roles where I used it, the responsibilities I held, and the professional context behind it.',roles:'professional profiles',open:'VIEW SKILL PROFILE ↗'}
  : {title:'Habilidades conectadas con experiencia.',intro:'Explora cada capacidad a través de los puestos donde la desarrollé, las responsabilidades que asumí y el contexto profesional que la respalda.',roles:'perfiles profesionales',open:'VER FICHA DE HABILIDAD ↗'});
</script>
<svelte:head><title>{copy.title} — Benito Anagua</title><meta name="description" content={copy.intro}/></svelte:head>
<PortalLayout {navItems}>
 <div class="skills-page">
  <header class="intro"><p class="eyebrow mono">CAPABILITIES / PROFESSIONAL EVIDENCE</p><h1>{copy.title}</h1><p>{copy.intro}</p><div class="summary mono">{skills.length.toString().padStart(2,'0')} SKILLS · {categories.length.toString().padStart(2,'0')} CATEGORIES</div></header>
  {#each categories as category}
   <section class="category" id={category.toLowerCase().replace(/[^a-z0-9]+/g,'-')}>
    <div class="category-head"><h2>{category}</h2><span class="mono">{skills.filter(s=>s.category===category).length.toString().padStart(2,'0')}</span></div>
    <div class="skill-grid">{#each skills.filter(s=>s.category===category) as skill}
     <a class="skill-card" href={'/habilidades/'+skill.slug}><div class="skill-name"><h3>{skill.name}</h3><span>↗</span></div><p>{skill.focusNames.length} {copy.roles}</p><div class="focus-tags">{#each skill.focusNames as focus}<span>{focus}</span>{/each}</div><span class="card-link mono">{copy.open}</span></a>
    {/each}</div>
   </section>
  {/each}
 </div>
</PortalLayout>
<style>
.skills-page{display:flex;flex-direction:column;gap:clamp(2.5rem,6vw,5rem)}.intro{padding:clamp(2rem,6vw,5rem);background:var(--color-surface);border:1px solid var(--color-outline-variant)}.eyebrow{font-size:.65rem;letter-spacing:.14em;color:var(--color-primary);margin-bottom:1.25rem}h1{font-size:clamp(2.3rem,6vw,5rem);line-height:1.04;letter-spacing:-.045em;max-width:900px;text-transform:none}.intro>p:not(.eyebrow){max-width:680px;color:var(--color-on-surface-variant);line-height:1.75;margin-top:1.5rem}.summary{font-size:.65rem;letter-spacing:.1em;color:var(--color-primary);margin-top:2rem}.category{display:flex;flex-direction:column;gap:1rem;scroll-margin-top:5rem}.category-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--color-outline-variant);padding-bottom:.8rem}.category-head h2{font-size:1.4rem;text-transform:none}.category-head span{font-size:.7rem;color:var(--color-primary)}.skill-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem}.skill-card{display:flex;flex-direction:column;min-height:170px;padding:1.1rem;border:1px solid var(--color-outline-variant);background:var(--color-surface);color:inherit;text-decoration:none;transition:box-shadow .2s,transform .2s}.skill-card:hover{box-shadow:var(--ring-primary);transform:translateY(-2px)}.skill-name{display:flex;justify-content:space-between;gap:.5rem;align-items:start}.skill-name h3{font-size:1rem;text-transform:none}.skill-name span{color:var(--color-primary)}.skill-card>p{font-size:.72rem;color:var(--color-on-surface-variant);margin-top:.8rem}.focus-tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.65rem}.focus-tags span{font-size:.6rem;padding:.2rem .35rem;border:1px solid var(--color-outline-variant);color:var(--color-on-surface-variant)}.card-link{font-size:.57rem;letter-spacing:.06em;color:var(--color-primary);margin-top:auto;padding-top:1.2rem}@media(max-width:850px){.skill-grid{grid-template-columns:repeat(2,minmax(0,1fr)}}@media(max-width:560px){.skill-grid{grid-template-columns:1fr}.skill-card{min-height:135px}}
</style>
