<script lang="ts">
	import { Metric } from '$folio';
	let {
		label,
		value,
		detail
	}: {
		label: string;
		value: string | number;
		detail?: string;
	} = $props();
</script>

<Metric {label} value={String(value)} note={detail} />
