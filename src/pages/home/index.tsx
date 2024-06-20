import { Component, Show, createEffect, createSignal } from 'solid-js';
import clsx from 'clsx';

import { Upgrade, buyUpgrade, claimDailyCombo, fetchUpgrades } from '../../api';
import { Instructions, Modal, Price, Upgrades, Image, Header } from '../../components';
import { store } from '../../store';

import s from './home.module.css';
import { makePersisted } from '@solid-primitives/storage';
import { LOCAL_STORAGE_KEY } from '../../constants';

export const HomePage: Component = () => {
	const [activeUpgrade, setActiveUpgrade] = createSignal<Upgrade | null>(null);
	const [upgrades, setUpgrades] = createSignal<Upgrade[]>([]);
	const [upgradesLoading, setUpgradesLoading] = createSignal<boolean>(false);
	const [profitPerHour, setProfitPerHour] = makePersisted(createSignal<number>(0), {
		name: LOCAL_STORAGE_KEY.PROFIT_PER_HOUR,
	});
	const [coins, setCoins] = makePersisted(createSignal<number>(0), { name: LOCAL_STORAGE_KEY.COINS });

	createEffect(async () => {
		if (!store.authToken()) {
			return;
		}
		setUpgradesLoading(true);
		const response = await fetchUpgrades(store.authToken());
		setUpgrades(response.upgradesForBuy);
		setUpgradesLoading(false);
	});

	const openUpgradeModal = (upgrade: Upgrade) => {
		setActiveUpgrade(upgrade);
	};

	const handleModalAction = async (upgrade: Upgrade | null) => {
		if (upgrade) {
			const newUpgrades = await buyUpgrade(store.authToken(), upgrade);
			setCoins((prev) => prev - upgrade.price);
			setProfitPerHour((prev) => prev + upgrade.profitPerHourDelta);
			if (newUpgrades.dailyCombo.isClaimed && newUpgrades.dailyCombo.upgradeIds.includes(upgrade.id)) {
				const { clickerUser } = await claimDailyCombo(store.authToken());
				setCoins(clickerUser.balanceCoins);
			}
			setActiveUpgrade(null);
			setUpgrades(newUpgrades.upgradesForBuy);
		}
	};

	const handleUpgradeModalClose = () => {
		setActiveUpgrade(null);
	};

	const isActionDisabled = (upgrade: Upgrade | null) => {
		return !upgrade || coins() < upgrade.price;
	};

	return (
		<Show when={store.initDataRaw()} fallback={<Instructions />}>
			<Modal
				item={activeUpgrade}
				onAction={handleModalAction}
				onClose={handleUpgradeModalClose}
				buttonLabel='Upgrade'
				coins={coins}
				isActionDisabled={isActionDisabled}
			>
				{(upgrade) => (
					<>
						<div class={s.image}>
							<Image id={upgrade().id} alt={upgrade().name} size={115} />
						</div>
						<div class={clsx(s.title, 'roboto-flex-600')}>{upgrade().name}</div>
						<div class={s.profit}>
							<div class={s.profitLabel}>Profit per hour</div>
							<Price price={upgrade().profitPerHourDelta} fontSize={12} coinSize={18} withPlus />
						</div>
						<Price class={s.price} price={upgrade().price} fontSize={24} coinSize={28} />
					</>
				)}
			</Modal>
			<div class={s.home}>
				<Header profitPerHour={profitPerHour} setProfitPerHour={setProfitPerHour} coins={coins} setCoins={setCoins} />
				<Upgrades upgrades={upgrades} upgradesLoading={upgradesLoading} onUpgradeClick={openUpgradeModal} />
			</div>
		</Show>
	);
};
