import { Component, For, Resource, Show } from 'solid-js';

import { Upgrade, UpgradesState } from '../../api';
import { Skeleton, SkeletonProps, UpgradeCard } from '..';

import s from './upgrades.module.css';

type UpgradesProps = {
	upgrades: Resource<UpgradesState>;
	onUpgradeClick: (upgrade: Upgrade) => void;
};

export const Upgrades: Component<UpgradesProps> = (props) => {
	const upgradesForBuy = () =>
		props
			.upgrades()
			?.upgradesForBuy.filter(
				(upgrade) =>
					upgrade.isAvailable && !upgrade.isExpired && (upgrade.maxLevel ? upgrade.level < upgrade.maxLevel : true),
			)
			.sort((a, b) => a.price / a.profitPerHourDelta - b.price / b.profitPerHourDelta) ?? [];

	const skeletons: SkeletonProps[] = Array.from({ length: 20 }).map(() => ({
		height: 113,
		radius: 20,
		color: '#272a2f',
	}));

	return (
		<Show
			when={props.upgrades.state === 'ready'}
			fallback={
				<For each={skeletons}>
					{(skeleton) => <Skeleton height={skeleton.height} radius={skeleton.radius} color={skeleton.color} />}
				</For>
			}
		>
			<div class={s.upgrades}>
				<For each={upgradesForBuy()}>
					{(upgrade) => <UpgradeCard upgrade={upgrade} onClick={props.onUpgradeClick} />}
				</For>
			</div>
		</Show>
	);
};
