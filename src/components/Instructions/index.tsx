import { Component } from 'solid-js';

import { store } from '@/store';

import s from './instructions.module.css';

export const Instructions: Component = () => {
	const handleClick = () => {
		const initDataRaw = prompt('Please enter the initDataRaw value');
		if (initDataRaw) {
			store.setInitDataRaw(initDataRaw);
		}
	};

	return (
		<div class={s.wrapper}>
			<h1>Instructions</h1>
			<p>
				This application requires the <code>initDataRaw</code> value to load your data.
			</p>
			<p>Either you haven't set it yet or it's invalid. If you have it, you can set it by following the instructions</p>
			<ol>
				<li>Open Hamster Kombat App on Telegram Web (Browser).</li>
				<li>
					Open the DevTools <code>F12</code>.
				</li>
				<li>Go to the Application Tab.</li>
				<li>Click on Session Storage.</li>
				<li>Select Hamster Kombat.</li>
				<li>
					On the bottom panel, right-click on <code>tgWebAppData</code>.
				</li>
				<li>
					Click on <strong>Copy Value</strong>.
				</li>
				<li>
					Set the <code>initDataRaw</code> value by clicking on the button below.
				</li>
			</ol>
			<div class={s.buttonWrapper} onClick={handleClick}>
				<button class='roboto-flex-600'>Set initDataRaw</button>
			</div>
		</div>
	);
};
