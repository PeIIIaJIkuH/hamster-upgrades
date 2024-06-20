import { Component } from 'solid-js';

import { IconProps } from './types';

export const Bolt: Component<IconProps> = (props) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 30' height={props.height} width={props.width} fill='none'>
			<defs>
				<linearGradient id='a' x1='8.5' x2='13.5' y1='0' y2='35.5' gradientUnits='userSpaceOnUse'>
					<stop stop-color='#FCD924' />
					<stop offset='1' stop-color='#FF5F1B' />
				</linearGradient>
			</defs>
			<path
				fill='url(#a)'
				d='m21.731 14.682-14 15a1 1 0 0 1-1.711-.874l1.832-9.167L.65 16.936a1 1 0 0 1-.375-1.625l14-15a1 1 0 0 1 1.711.875l-1.837 9.177 7.203 2.7a1 1 0 0 1 .375 1.62h.005Z'
			/>
		</svg>
	);
};
