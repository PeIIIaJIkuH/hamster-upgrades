import { Component } from 'solid-js';

import { IconProps } from './types';

export const Check: Component<IconProps> = (props) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 12 12'
			height={props.height}
			width={props.width}
			fill={props.color ?? 'currentColor'}
		>
			<path d='M6 0C2.692 0 0 2.692 0 6s2.692 6 6 6 6-2.692 6-6-2.692-6-6-6Zm3.123 3.989L5.246 8.605a.463.463 0 0 1-.346.164h-.008a.458.458 0 0 1-.343-.153L2.887 6.77a.46.46 0 0 1-.126-.316c0-.254.209-.462.462-.462a.46.46 0 0 1 .35.161L4.88 7.604l3.536-4.209a.461.461 0 0 1 .707.594Z' />
		</svg>
	);
};
