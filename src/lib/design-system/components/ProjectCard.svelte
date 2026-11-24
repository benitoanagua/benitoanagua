<script lang="ts">
export interface PortfolioProject {
  title: string;
  description: string;
  href: string;
  image?: string;
  imageAlt?: string;
  year?: string;
  category?: string;
  tags?: string[];
  sourceHref?: string;
}
export interface ProjectCardLabels { view: string; case: string; source: string; tech: string }
let {project,labels={view:'View',case:'View case study',source:'Source',tech:'Technologies'}}:{project:PortfolioProject;labels?:ProjectCardLabels}=$props();
</script>
<article class="project-card">
  {#if project.image}
    <a class="visual" href={project.href} aria-label={labels.view+' '+project.title}>
      <img src={project.image} alt={project.imageAlt||project.title} loading="lazy" />
    </a>
  {/if}
  <div class="body">
    <div class="meta">{#if project.category}<span>{project.category}</span>{/if}{#if project.year}<span>{project.year}</span>{/if}</div>
    <h3><a href={project.href}>{project.title}</a></h3>
    <p>{project.description}</p>
    {#if project.tags?.length}<ul class="tags" aria-label={labels.tech}>{#each project.tags as tag}<li>{tag}</li>{/each}</ul>{/if}
    <div class="links"><a class="case" href={project.href}>{labels.case} <span aria-hidden="true">↗</span></a>{#if project.sourceHref}<a href={project.sourceHref} target="_blank" rel="noreferrer">{labels.source} <span aria-hidden="true">↗</span></a>{/if}</div>
  </div>
</article>
<style>
.project-card{height:100%;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--ds-border);border-radius:var(--ds-radius);background:var(--ds-surface);color:var(--ds-text)}.visual{display:block;aspect-ratio:16/9;overflow:hidden;background:var(--ds-border)}.visual img{width:100%;height:100%;object-fit:cover;transition:transform 250ms}.visual:hover img{transform:scale(1.025)}.body{display:flex;flex:1;flex-direction:column;padding:1.25rem}.meta{display:flex;gap:.75rem;color:var(--ds-muted);font:.7rem var(--ds-font);text-transform:uppercase;letter-spacing:.06em}.body h3{margin:.65rem 0;font:600 1.25rem/1.2 var(--ds-font)}h3 a,.links a{color:inherit;text-decoration:none}h3 a:hover,.links a:hover{text-decoration:underline;text-underline-offset:.2em}.body p{margin:0;color:var(--ds-muted);font-size:.875rem;line-height:1.6}.tags{display:flex;flex-wrap:wrap;gap:.4rem;padding:0;margin:1rem 0 0;list-style:none}.tags li{padding:.25rem .5rem;border:1px solid var(--ds-border);border-radius:999px;color:var(--ds-muted);font-size:.7rem}.links{display:flex;gap:1rem;margin-top:auto;padding-top:1.25rem;font-size:.8125rem;font-weight:600}.case{margin-right:auto}
</style>