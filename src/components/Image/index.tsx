import { Component, createEffect, createSignal } from 'solid-js';

import { imageExists } from './helpers';

import s from './image.module.css';

type ImageProps = {
	src: string;
	alt: string;
	size: number;
};

export const Image: Component<ImageProps> = (props) => {
	const [imageType, setImageType] = createSignal<'svg' | 'png'>('png');
	const src = `/images/${props.src}`;

	createEffect(() => {
		const svgPath = `${src}.svg`;

		imageExists(svgPath, (exists) => {
			if (exists) {
				setImageType('svg');
			} else {
				setImageType('png');
			}
		});
	});

	return (
		<div class={s.wrapper} style={{ width: `${props.size}px`, height: `${props.size}px` }}>
			<img class={s.image} src={`${src}.${imageType()}`} alt={props.alt} />
		</div>
	);
};
