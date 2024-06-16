import { Component, For, Show, createResource } from 'solid-js';
import { fetchUpgrades } from '../../api';
import s from './upgrades.module.css';
import { Skeleton, SkeletonProps, TitleCard, UpgradeCard } from '..';

export const Upgrades: Component = () => {
	const [upgrades] = createResource(fetchUpgrades);
	const upgradesForBuy = () =>
		upgrades()
			?.upgradesForBuy.filter(
				(upgrade) => upgrade.isAvailable && !upgrade.isExpired && upgrade.maxLevel !== upgrade.level,
			)
			.sort((a, b) => a.price / a.profitPerHourDelta - b.price / b.profitPerHourDelta) ?? [];

	const skeletons: SkeletonProps[] = Array.from({ length: 20 }).map(() => ({
		height: 113,
		radius: 20,
		color: '#272a2f',
	}));

	return (
		<div class={s.upgrades}>
			<TitleCard class={s.upgradesTitle}>Upgrades</TitleCard>
			<Show
				when={upgrades.state === 'ready'}
				fallback={
					<For each={skeletons}>
						{(skeleton) => <Skeleton height={skeleton.height} radius={skeleton.radius} color={skeleton.color} />}
					</For>
				}
			>
				<For each={upgradesForBuy()}>{(upgrade) => <UpgradeCard upgrade={upgrade} />}</For>
			</Show>
		</div>
	);
};
