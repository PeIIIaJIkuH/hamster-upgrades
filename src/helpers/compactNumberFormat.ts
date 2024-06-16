export const compactNumberFormat = (n: number) =>
	new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'short',
		maximumFractionDigits: 2,
	}).format(n);
