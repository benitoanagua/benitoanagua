<script lang="ts">
	import { Notice } from '$folio';

	type Tone = 'neutral' | 'success' | 'warning' | 'error';

	type Props = {
		label: string;
		detail?: string;
		tone?: Tone;
	};

	let props: Props = $props();
	const { label, detail, tone = 'neutral' } = props;
	const folioTone = $derived(tone === 'neutral' ? 'note' : tone);
</script>

<Notice label={label} tone={folioTone}>{detail ?? ''}</Notice>
