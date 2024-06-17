import { Component, Show, createResource, createSignal } from 'solid-js';
import clsx from 'clsx';

import { Upgrade, buyUpgrade, claimDailyCombo, fetchUpgrades } from '../../api';
import { Instructions, Modal, Price, Upgrades, Image, Header } from '../../components';
import { initDataRaw } from '../../store';

import s from './home.module.css';

export const HomePage: Component = () => {
	const [activeUpgrade, setActiveUpgrade] = createSignal<Upgrade | null>(null);
	const [upgrades, { refetch: refetchUpgrades }] = createResource(fetchUpgrades);
	const [profitPerHour, setProfitPerHour] = createSignal<number>(0);
	const [coins, setCoins] = createSignal<number>(0);

	const openUpgradeModal = (upgrade: Upgrade) => {
		setActiveUpgrade(upgrade);
	};

	const handleModalAction = async (upgrade: Upgrade | null) => {
		if (upgrade) {
			const newUpgrades = await buyUpgrade(upgrade);
			setCoins((prev) => prev - upgrade.price);
			setProfitPerHour((prev) => prev + upgrade.profitPerHourDelta);
			if (newUpgrades.dailyCombo.isClaimed && newUpgrades.dailyCombo.upgradeIds.includes(upgrade.id)) {
				const { clickerUser } = await claimDailyCombo();
				setCoins(clickerUser.balanceCoins);
			}
			setActiveUpgrade(null);
			await refetchUpgrades();
		}
	};

	const handleUpgradeModalClose = () => {
		setActiveUpgrade(null);
	};

	const isActionDisabled = (upgrade: Upgrade | null) => {
		return !upgrade || coins() < upgrade.price;
	};

	return (
		<>
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
				<Show when={initDataRaw()} fallback={<Instructions />}>
					<Upgrades upgrades={upgrades} onUpgradeClick={openUpgradeModal} />
				</Show>
			</div>
		</>
	);
};
