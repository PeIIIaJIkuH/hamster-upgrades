import { Component } from 'solid-js';
import s from './skeleton.module.css';

export type SkeletonProps = {
	height: number;
	width?: number;
	radius: number;
	color: string;
};

export const Skeleton: Component<SkeletonProps> = (props) => {
	return (
		<div
			class={s.skeleton}
			style={{
				height: `${props.height}px`,
				width: props.width ? `${props.width}px` : undefined,
				'border-radius': `${props.radius}px`,
				background: props.color,
			}}
		>
			<div class={s.animationLine} />
		</div>
	);
};
