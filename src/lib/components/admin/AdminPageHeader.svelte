<script lang="ts">
	import { PageHeader } from '$folio';
	let {
		kicker = 'PORTFOLIO CMS',
		title,
		description
	}: {
		kicker?: string;
		title: string;
		description?: string;
	} = $props();
</script>

<PageHeader eyebrow={kicker} {title} {description} />
