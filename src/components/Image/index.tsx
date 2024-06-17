import { Component } from 'solid-js';

import { getImagePath } from './helpers';

import s from './image.module.css';

type ImageProps = {
	id: string;
	alt: string;
	size: number;
};

export const Image: Component<ImageProps> = (props) => {
	return (
		<div class={s.wrapper} style={{ width: `${props.size}px`, height: `${props.size}px` }}>
			<img class={s.image} src={getImagePath(props.id)} alt={props.alt} />
		</div>
	);
};
