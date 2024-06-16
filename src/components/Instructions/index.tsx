import { Component } from 'solid-js';

import s from './instructions.module.css';

export const Instructions: Component = () => {
	return (
		<div class={s.wrapper}>
			<p>
				This application requires the <code class={s.code}>initDataRaw</code> value to load your data.
			</p>
			<p>Either you haven't set it yet or it's invalid. If you have it, you can set it by following the instructions</p>
			<ol>
				<li>Open Hamster Kombat App on Telegram Web (Browser).</li>
				<li>
					Open the DevTools <code class={s.code}>F12</code>.
				</li>
				<li>Go to the Application Tab.</li>
				<li>Click on Session Storage.</li>
				<li>Select Hamster Kombat.</li>
				<li>
					On the bottom panel, right-click on <code class={s.code}>tgWebAppData</code>.
				</li>
				<li>
					Click on <strong>Copy Value</strong>.
				</li>
				<li>
					Select the <code class={s.code}>/set-init-data</code> command in the Hamster Upgrades bot and send the value.
				</li>
			</ol>
		</div>
	);
};
