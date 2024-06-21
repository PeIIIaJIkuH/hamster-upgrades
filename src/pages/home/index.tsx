import { Component, Match, Switch, createEffect, createSignal } from 'solid-js';

import { makePersisted } from '@solid-primitives/storage';
import clsx from 'clsx';

import { DailyCombo, Upgrade, buyUpgrade, claimDailyCombo, fetchUpgrades } from '@/api';
import { Instructions, Modal, Price, Upgrades, Image, Header, Loader, notifySuccess } from '@/components';
import { LOCAL_STORAGE_KEY } from '@/constants';
import { store } from '@/store';

import s from './home.module.css';

export const HomePage: Component = () => {
	const [activeUpgrade, setActiveUpgrade] = createSignal<Upgrade | null>(null);
	const [upgrades, setUpgrades] = createSignal<Upgrade[]>([]);
	const [upgradesLoading, setUpgradesLoading] = createSignal<boolean>(false);
	const [dailyCombo, setDailyCombo] = createSignal<DailyCombo | null>(null);
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
		setDailyCombo(response.dailyCombo);
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
			const combo = dailyCombo();
			if (combo && !combo.isClaimed && newUpgrades.dailyCombo.upgradeIds.length === 3) {
				const { clickerUser } = await claimDailyCombo(store.authToken());
				setCoins(clickerUser.balanceCoins);
				notifySuccess('Daily combo claimed successfully');
			} else if (combo && combo.upgradeIds.length < newUpgrades.dailyCombo.upgradeIds.length) {
				setDailyCombo(newUpgrades.dailyCombo);
				notifySuccess(
					`Daily combo progress: ${newUpgrades.dailyCombo.upgradeIds.length}/3 upgrades`,
				);
			}
			setUpgrades(newUpgrades.upgradesForBuy);
			notifySuccess('Upgrade bought successfully');
			setActiveUpgrade(null);
		}
	};

	const handleUpgradeModalClose = () => {
		setActiveUpgrade(null);
	};

	const isActionDisabled = (upgrade: Upgrade | null) => {
		return !upgrade || coins() < upgrade.price;
	};

	return (
		<Switch>
			<Match when={store.authTokenLoading()}>
				<Loader />
			</Match>
			<Match when={!store.initDataRaw()}>
				<Instructions />
			</Match>
			<Match when={store.initDataRaw()}>
				<Modal
					item={activeUpgrade}
					onAction={handleModalAction}
					onClose={handleUpgradeModalClose}
					buttonLabel='Upgrade'
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
					<Header
						profitPerHour={profitPerHour}
						setProfitPerHour={setProfitPerHour}
						coins={coins}
						setCoins={setCoins}
						dailyComboAmount={dailyCombo}
					/>
					<Upgrades
						upgrades={upgrades}
						upgradesLoading={upgradesLoading}
						onUpgradeClick={openUpgradeModal}
						coins={coins}
					/>
				</div>
			</Match>
		</Switch>
	);
};
