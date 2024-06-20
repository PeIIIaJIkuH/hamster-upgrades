import { Component } from 'solid-js';

import s from './loader.module.css';

export const Loader: Component = () => {
	return (
		<div class={s.wrapper}>
			<div class={s.loader} />
		</div>
	);
};
