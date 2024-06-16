import { Component, Show } from 'solid-js';

import { Instructions, Upgrades } from '../../components';
import { initDataRaw } from '../../store';

import s from './home.module.css';

export const HomePage: Component = () => {
	return (
		<div class={s.home}>
			<Show when={initDataRaw()} fallback={<Instructions />}>
				<Upgrades />
			</Show>
		</div>
	);
};
