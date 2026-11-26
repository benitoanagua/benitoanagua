<script lang="ts">
	import { Notice } from '$folio';

	type Tone = 'neutral' | 'success' | 'warning' | 'error';
	let {
		label,
		detail,
		tone = 'neutral'
	}: {
		label: string;
		detail?: string;
		tone?: Tone;
	} = $props();
	const folioTone = $derived(tone === 'neutral' ? 'note' : tone);
</script>

<Notice label={label} tone={folioTone}>{detail ?? ''}</Notice>
