import { Component, Show } from 'solid-js';

import s from './home.module.css';
import { Instructions, Upgrades } from '../../components';
import { initDataRaw } from '../../store';

export const HomePage: Component = () => {
	return (
		<div class={s.home}>
			<Show when={initDataRaw()} fallback={<Instructions />}>
				<Upgrades />
			</Show>
		</div>
	);
};
