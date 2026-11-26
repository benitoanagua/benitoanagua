<script lang="ts">
	import { Notice } from '$folio';

	type Tone = 'neutral' | 'success' | 'warning' | 'error';

	type Props = {
		label: string;
		detail?: string;
		tone?: Tone;
	};

	let { label, detail, tone = 'neutral' }: Props = $props();
	const folioTone = $derived(tone === 'neutral' ? 'note' : tone);
</script>

<Notice {label} tone={folioTone}>{detail ?? ''}</Notice>
