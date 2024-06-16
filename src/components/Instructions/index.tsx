import { Component } from 'solid-js';

import { setInitDataRaw } from '../../store';

import s from './instructions.module.css';

export const Instructions: Component = () => {
	const handlePromptClick = () => {
		const initData = prompt('Please enter the initDataRaw value:');
		if (initData !== null) {
			setInitDataRaw(initData);
		}
	};

	return (
		<div class={s.wrapper}>
			<p>This application requires the initDataRaw value to load your data.</p>
			<p>Follow these steps to obtain it:</p>
			<ol>
				<li>Open Hamster Kombat App on Telegram Web (Browser).</li>
				<li>Open DevTools (F12) -&gt; Application Tab -&gt; Session Storage -&gt; Select Hamster Kombat.</li>
				<li>
					On the bottom panel, right-click on <code>tgWebAppData</code> -&gt; Click on <strong>Copy Value</strong>.
				</li>
				<li>Press the "Set the tgWebAppData" button below and paste the value.</li>
			</ol>

			<button class={s.button} onClick={handlePromptClick}>
				Set the tgWebAppData
			</button>
		</div>
	);
};
