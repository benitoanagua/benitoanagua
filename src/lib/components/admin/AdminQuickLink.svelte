<script lang="ts">
	import { ActionLink } from '$folio';
	let {
		title,
		description,
		href
	}: {
		title: string;
		description: string;
		href: string;
	} = $props();
</script>

<ActionLink {title} {description} {href} actionLabel="Abrir sección" />
