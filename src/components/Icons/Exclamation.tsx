import { Component } from 'solid-js';

import { IconProps } from './types';

export const Exclamation: Component<IconProps> = (props) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 12 12'
			height={props.height}
			width={props.width}
			fill={props.color ?? 'currentColor'}
		>
			<path d='M6 0C2.692 0 0 2.692 0 6s2.692 6 6 6 6-2.692 6-6-2.692-6-6-6Zm0 9.228a.58.58 0 0 1-.577-.577A.58.58 0 0 1 6 8.074a.58.58 0 0 1 .577.577.58.58 0 0 1-.577.577Zm.627-5.802-.166 3.519a.464.464 0 0 1-.462.462.464.464 0 0 1-.461-.462l-.166-3.518v-.028a.63.63 0 0 1 .627-.627.63.63 0 0 1 .627.627l-.001.027h.002Z' />
		</svg>
	);
};
