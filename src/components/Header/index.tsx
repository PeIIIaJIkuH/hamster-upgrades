import { Accessor, Component, Setter, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage';
import toast from 'solid-toast';
import clsx from 'clsx';

import {
	DailyCipher,
	DailyCombo,
	claimDailyCipher,
	fetchConfig,
	fetchSync,
	isErrorResponse,
	sendTaps,
} from '../../api';
import { LOCAL_STORAGE_KEY } from '../../constants';
import { store } from '../../store';
import { Price, TitleCard } from '..';

import boltIcon from '/icons/bolt.svg';
import s from './header.module.css';

type HeaderProps = {
	profitPerHour: Accessor<number>;
	setProfitPerHour: Setter<number>;
	coins: Accessor<number>;
	setCoins: Setter<number>;
	dailyComboAmount: Accessor<DailyCombo | null>;
};

export const Header: Component<HeaderProps> = (props) => {
	const [earnPerTap, setEarnPerTap] = makePersisted(createSignal<number>(0), { name: LOCAL_STORAGE_KEY.EARN_PER_TAP });
	const [coinsToLevelUp, setCoinsToLevelUp] = makePersisted(createSignal<number>(0), {
		name: LOCAL_STORAGE_KEY.COINS_TO_LEVEL_UP,
	});
	const [dailyCipher, setDailyCipher] = createSignal<DailyCipher>({ cipher: '', isClaimed: false });

	const [taps, setTaps] = makePersisted(createSignal<number>(0), { name: LOCAL_STORAGE_KEY.TAPS });
	const [maxTaps, setMaxTaps] = makePersisted(createSignal<number>(0), { name: LOCAL_STORAGE_KEY.MAX_TAPS });

	let outerInterval: number;
	let innerInterval: number;

	createEffect(() => {
		const sync = async () => {
			if (!store.authToken()) {
				return;
			}
			if (innerInterval) clearInterval(innerInterval);

			const { clickerUser } = await fetchSync(store.authToken());
			setEarnPerTap(clickerUser.earnPerTap);
			props.setProfitPerHour(clickerUser.earnPassivePerHour);
			props.setCoins(clickerUser.balanceCoins);
			setTaps(clickerUser.availableTaps);
			setMaxTaps(clickerUser.maxTaps);

			const tapCount = Math.floor(clickerUser.availableTaps / clickerUser.earnPerTap);
			if (tapCount > 0) {
				const { clickerUser: updatedUser } = await sendTaps(store.authToken(), tapCount, clickerUser.availableTaps);
				setEarnPerTap(updatedUser.earnPerTap);
				props.setProfitPerHour(updatedUser.earnPassivePerHour);
				props.setCoins(updatedUser.balanceCoins);
				setTaps(updatedUser.availableTaps);
				setMaxTaps(updatedUser.maxTaps);
			}

			innerInterval = window.setInterval(() => {
				props.setCoins((prev) => prev + clickerUser.earnPassivePerSec);
				setTaps((prev) => Math.min(prev + clickerUser.tapsRecoverPerSec, clickerUser.maxTaps));
			}, 1000);

			const { clickerConfig, dailyCipher: cipher } = await fetchConfig(store.authToken());
			setDailyCipher(cipher);
			for (const { level, coinsToLeveUp } of clickerConfig.userLevels_balanceCoins) {
				if (clickerUser.level === level) {
					setCoinsToLevelUp(coinsToLeveUp ?? 0);
					break;
				}
			}
		};

		sync();

		outerInterval = window.setInterval(sync, 5 * 60 * 1000);

		onCleanup(() => {
			if (outerInterval) clearInterval(outerInterval);
			if (innerInterval) clearInterval(innerInterval);
		});
	});

	const handleClaim = async () => {
		const cipher = prompt('Enter the cipher');
		if (cipher) {
			const response = await claimDailyCipher(store.authToken(), cipher);
			if (!isErrorResponse(response)) {
				props.setCoins(response.clickerUser.balanceCoins);
				setDailyCipher({ cipher: cipher.toUpperCase(), isClaimed: true });
				toast.success('Daily cipher claimed successfully');
			}
		}
	};

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
					<Price price={props.profitPerHour()} fontSize={14} coinSize={20} withPlus />
				</div>
			</div>
			<Price class={s.coins} price={props.coins()} fontSize={40} coinSize={60} standard withoutDecimals separator=' ' />
			<TitleCard class={s.taps}>
				<img src={boltIcon} alt='bolt' height={26} />
				<div class={s.tapsCount}>
					{taps()} / {maxTaps()}
				</div>
			</TitleCard>
			<TitleCard class={s.daily}>
				<div class={s.dailyItem}>
					<div>Daily combo</div>
					<div>{props.dailyComboAmount()?.upgradeIds.length} / 3</div>
				</div>
				<div class={s.dailyItem}>
					<div>Daily cipher</div>
					<div>
						{dailyCipher().isClaimed ? (
							<button class={s.claimed}>Claimed</button>
						) : (
							<button class={s.claim} onClick={handleClaim}>
								Claim
							</button>
						)}
					</div>
				</div>
			</TitleCard>
		</div>
	);
};
