import { Component, Show, createResource, createSignal } from 'solid-js';
import clsx from 'clsx';

import { Upgrade, buyUpgrade, claimDailyCombo, fetchUpgrades } from '../../api';
import { Instructions, Modal, Price, Upgrades, Image, Header } from '../../components';
import { initDataRaw } from '../../store';

import s from './home.module.css';

export const HomePage: Component = () => {
	const [activeUpgrade, setActiveUpgrade] = createSignal<Upgrade | null>(null);
	const [upgrades, { refetch: refetchUpgrades }] = createResource(fetchUpgrades);

	const openUpgradeModal = (upgrade: Upgrade) => {
		setActiveUpgrade(upgrade);
	};

	const handleModalAction = async (upgrade: Upgrade | null) => {
		if (upgrade) {
			const newUpgrades = await buyUpgrade(upgrade);
			if (newUpgrades.dailyCombo.isClaimed && newUpgrades.dailyCombo.upgradeIds.includes(upgrade.id)) {
				claimDailyCombo();
			}
			setActiveUpgrade(null);
			await refetchUpgrades();
		}
	};

	const handleUpgradeModalClose = () => {
		setActiveUpgrade(null);
	};

	return (
		<>
			<Modal item={activeUpgrade} onAction={handleModalAction} onClose={handleUpgradeModalClose} buttonLabel='Upgrade'>
				{(upgrade) => (
					<>
						<div class={s.image}>
							<Image src={upgrade().id} alt={upgrade().name} size={115} />
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
				<Header />
				<Show when={initDataRaw()} fallback={<Instructions />}>
					<Upgrades upgrades={upgrades} onUpgradeClick={openUpgradeModal} />
				</Show>
			</div>
		</>
	);
};
