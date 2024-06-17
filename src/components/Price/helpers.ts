export const numberFormat = (n: number, standard?: boolean, withoutDecimals?: boolean, separator?: string) => {
	const formattedNumber = new Intl.NumberFormat('en-US', {
		notation: standard ? 'standard' : 'compact',
		compactDisplay: 'short',
		maximumFractionDigits: withoutDecimals ? 0 : 2,
	}).format(n);
	return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
};
