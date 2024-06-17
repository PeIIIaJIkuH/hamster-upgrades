export const numberFormat = (n: number, standard?: boolean, withoutDecimals?: boolean) =>
	new Intl.NumberFormat('en-US', {
		notation: standard ? 'standard' : 'compact',
		compactDisplay: 'short',
		maximumFractionDigits: withoutDecimals ? 0 : 2,
	}).format(n);
