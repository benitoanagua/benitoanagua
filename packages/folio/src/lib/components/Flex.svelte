<script lang="ts">
	type Direction = 'row' | 'column';
	type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	type Wrap = 'wrap' | 'nowrap' | 'wrap-reverse';
	type Gap = keyof typeof gapMap | (string & {});
	type Padding = keyof typeof paddingMap | (string & {});

	const gapMap = {
		none: '0',
		'1': 'var(--space-1)',
		'2': 'var(--space-2)',
		'3': 'var(--space-3)',
		'4': 'var(--space-4)',
		'5': 'var(--space-5)',
		'6': 'var(--space-6)',
		'8': 'var(--space-8)',
		'10': 'var(--space-10)',
		'12': 'var(--space-12)'
	} as const;

	const paddingMap = {
		none: '0',
		'1': 'var(--space-1)',
		'2': 'var(--space-2)',
		'3': 'var(--space-3)',
		'4': 'var(--space-4)',
		'5': 'var(--space-5)',
		'6': 'var(--space-6)',
		'8': 'var(--space-8)'
	} as const;

	let {
		direction = 'column',
		align = 'stretch',
		justify = 'start',
		wrap = 'nowrap',
		gap = '4',
		rowGap,
		columnGap,
		padding = 'none',
		paddingBlock,
		paddingInline,
		children,
		...restProps
	}: {
		direction?: Direction;
		align?: Align;
		justify?: Justify;
		wrap?: Wrap;
		gap?: Gap;
		rowGap?: Gap;
		columnGap?: Gap;
		padding?: Padding;
		paddingBlock?: Padding;
		paddingInline?: Padding;
		children?: import('svelte').Snippet;
	} & Record<string, unknown> = $props();

	const resolvedGap = $derived(
		rowGap || columnGap
			? `${gapMap[rowGap as keyof typeof gapMap] || rowGap || '0'} ${gapMap[columnGap as keyof typeof gapMap] || columnGap || '0'}`
			: gapMap[gap as keyof typeof gapMap] || gap
	);

	const resolvedPaddingBlock = $derived(
		paddingMap[paddingBlock as keyof typeof paddingMap] ||
			paddingBlock ||
			paddingMap[padding as keyof typeof paddingMap] ||
			padding
	);

	const resolvedPaddingInline = $derived(
		paddingMap[paddingInline as keyof typeof paddingMap] ||
			paddingInline ||
			paddingMap[padding as keyof typeof paddingMap] ||
			padding
	);
</script>

<div
	class="ds-flex"
	style="--ds-flex-direction: {direction}; --ds-flex-align: {align}; --ds-flex-justify: {justify}; --ds-flex-wrap: {wrap}; --ds-flex-gap: {resolvedGap}; --ds-flex-padding-block: {resolvedPaddingBlock}; --ds-flex-padding-inline: {resolvedPaddingInline};"
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.ds-flex {
		display: flex;
		flex-direction: var(--ds-flex-direction);
		align-items: var(--ds-flex-align);
		justify-content: var(--ds-flex-justify);
		flex-wrap: var(--ds-flex-wrap);
		gap: var(--ds-flex-gap);
		padding-block: var(--ds-flex-padding-block);
		padding-inline: var(--ds-flex-padding-inline);
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
	}
	/* Allow flex items to shrink below their content size to prevent overflow */
	:global(.ds-flex > *) {
		min-width: 0;
		flex-shrink: 1;
	}
</style>
