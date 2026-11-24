<script lang="ts">
export interface SocialLink{label:string;href:string}
let{items,compact=false}:{items:SocialLink[];compact?:boolean}=$props();
</script>
<nav class="social-links" aria-label="Social and professional links" class:compact>{#each items as item}<a href={item.href} target="_blank" rel="noreferrer">{item.label}<span aria-hidden="true">↗</span></a>{/each}</nav>
<style>
.social-links{display:flex;flex-wrap:wrap;gap:.75rem 1.25rem}.social-links a{display:inline-flex;align-items:center;gap:.35rem;color:var(--ds-text);font:600 .8125rem var(--ds-font);text-decoration:none}.social-links a:hover{text-decoration:underline;text-underline-offset:.2em}.social-links span{color:var(--ds-muted)}.compact{gap:.5rem}.compact a{padding:.5rem .75rem;border:1px solid var(--ds-border);border-radius:999px}
</style>