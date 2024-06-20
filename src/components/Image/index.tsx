import { Component } from 'solid-js';

import clsx from 'clsx';

import { getImagePath } from './helpers';

import s from './image.module.css';

type ImageProps = {
	id: string;
	alt: string;
	size: number;
	class?: string;
};

export const Image: Component<ImageProps> = (props) => {
	return (
		<div class={clsx(s.wrapper, props.class)} style={{ width: `${props.size}px`, height: `${props.size}px` }}>
			<img class={s.image} src={getImagePath(props.id)} alt={props.alt} />
		</div>
	);
};
