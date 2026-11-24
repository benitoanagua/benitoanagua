<script lang="ts">
let{value,label,note}:{value:string;label:string;note?:string}=$props();
</script>
<div class="metric"><p class="value">{value}</p><p class="label">{label}</p>{#if note}<p class="note">{note}</p>{/if}</div>
<style>
.metric{color:var(--ds-text)}.value{margin:0;font:400 clamp(2rem,5vw,3.75rem)/1 var(--font-display,var(--ds-font));letter-spacing:-.04em}.label{margin:.6rem 0 0;font:600 .8125rem var(--ds-font)}.note{margin:.35rem 0 0;color:var(--ds-muted);font-size:.75rem;line-height:1.5}
</style>