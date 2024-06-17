import { Component, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import clsx from 'clsx';

import { claimDailyCipher, fetchConfig, fetchSync, sendTaps } from '../../api';
import { Price, TitleCard } from '..';

import boltIcon from '/icons/bolt.svg';
import s from './header.module.css';

export const Header: Component = () => {
	const [earnPerTap, setEarnPerTap] = createSignal<number>(0);
	const [coinsToLevelUp, setCoinsToLevelUp] = createSignal<number | null>(0);
	const [profitPerHour, setProfitPerHour] = createSignal<number>(0);
	const [coins, setCoins] = createSignal<number>(0);
	const [taps, setTaps] = createSignal<number>(0);
	const [maxTaps, setMaxTaps] = createSignal<number>(0);

	let outerInterval: number;
	let innerInterval: number;

	createEffect(() => {
		const sync = async () => {
			if (innerInterval) clearInterval(innerInterval);

			const { clickerUser } = await fetchSync();
			setEarnPerTap(clickerUser.earnPerTap);
			setProfitPerHour(clickerUser.earnPassivePerHour);
			setCoins(clickerUser.balanceCoins);
			setTaps(clickerUser.availableTaps);
			setMaxTaps(clickerUser.maxTaps);

			const tapCount = Math.floor(clickerUser.availableTaps / clickerUser.earnPerTap);
			if (tapCount > 0) {
				const { clickerUser: updatedUser } = await sendTaps(tapCount, clickerUser.availableTaps);
				setEarnPerTap(updatedUser.earnPerTap);
				setProfitPerHour(updatedUser.earnPassivePerHour);
				setCoins(updatedUser.balanceCoins);
				setTaps(updatedUser.availableTaps);
				setMaxTaps(updatedUser.maxTaps);
			}

			innerInterval = setInterval(() => {
				setCoins((prev) => prev + clickerUser.earnPassivePerSec);
				setTaps((prev) => Math.min(prev + clickerUser.tapsRecoverPerSec, clickerUser.maxTaps));
			}, 1000);

			const { clickerConfig, dailyCipher } = await fetchConfig();
			for (const { level, coinsToLeveUp } of clickerConfig.userLevels_balanceCoins) {
				if (clickerUser.level === level) {
					setCoinsToLevelUp(coinsToLeveUp);
					break;
				}
			}
			if (!dailyCipher.isClaimed) {
				await claimDailyCipher(dailyCipher.cipher);
			}
		};

		sync();

		outerInterval = setInterval(sync, 5 * 60 * 1000);

		onCleanup(() => {
			if (outerInterval) clearInterval(outerInterval);
			if (innerInterval) clearInterval(innerInterval);
		});
	});

	return (
		<div class={s.header}>
			<div class={s.info}>
				<div class={s.card}>
					<div class={clsx(s.title, s.textOrange)}>Earn per tap</div>
					<Price price={earnPerTap()} fontSize={14} coinSize={20} withPlus />
				</div>
				<div class={s.card}>
					<div class={clsx(s.title, s.textPurple)}>Coins to level up</div>
					<Show when={coinsToLevelUp()} fallback={<div>Max level</div>}>
						{(c) => <Price price={c()} fontSize={14} />}
					</Show>
				</div>
				<div class={s.card}>
					<div class={clsx(s.title, s.textGreen)}>Profit per hour</div>
					<Price price={profitPerHour()} fontSize={14} coinSize={20} withPlus />
				</div>
			</div>
			<Price class={s.coins} price={coins()} fontSize={40} coinSize={60} standard withoutDecimals separator=' ' />
			<TitleCard class={s.taps}>
				<img src={boltIcon} alt='bolt' height={26} />
				<div class={s.tapsCount}>
					{taps()} / {maxTaps()}
				</div>
			</TitleCard>
		</div>
	);
};