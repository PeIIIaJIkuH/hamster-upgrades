import { Accessor, Component, createEffect, createSignal, onCleanup } from 'solid-js';
import clsx from 'clsx';

import { Upgrade } from '../../api';
import { Icons, Image, Price } from '..';

import s from './upgrade-card.module.css';

type UpgradeProps = {
	upgrade: Upgrade;
	onClick: (upgrade: Upgrade) => void;
	coins: Accessor<number>;
};

export const UpgradeCard: Component<UpgradeProps> = (props) => {
	const [seconds, setSeconds] = createSignal<number>(props.upgrade.cooldownSeconds ?? 0);
	const canBuy = props.coins() >= props.upgrade.price && seconds() <= 0;

	const formattedTime = () => new Date(seconds() * 1000).toISOString().substring(11, 19);

	createEffect(() => {
		if (!props.upgrade.cooldownSeconds) {
			return;
		}
		const intervalId = setInterval(() => {
			if (seconds() <= 0) {
				clearInterval(intervalId);
			} else {
				setSeconds((prev) => prev - 1);
			}
		}, 1000);

		onCleanup(() => clearInterval(intervalId));
	});

	return (
		<div
			class={clsx(s.upgradeCard, !canBuy && s.grayscale)}
			onClick={canBuy ? [props.onClick, props.upgrade] : undefined}
		>
			<div class={s.top}>
				<div class={s.image}>
					<Image id={props.upgrade.id} alt={props.upgrade.name} size={60} />
					{seconds() > 0 && (
						<div class={clsx(s.cooldown, 'roboto-flex-600')}>
							<Icons.Clock height={24} color='#ffffff' />
							{formattedTime()}
						</div>
					)}
				</div>
				<div class={s.info}>
					<div>{props.upgrade.name}</div>
					<div>
						<div class={s.profitLabel}>Profit per hour</div>
						<Price
							price={props.upgrade.currentProfitPerHour || props.upgrade.profitPerHourDelta}
							withPlus={!props.upgrade.currentProfitPerHour}
							fontSize={12}
							coinSize={14}
							class={clsx(!canBuy && s.imageGrayscale)}
						/>
					</div>
				</div>
			</div>
			<div class={s.bottom}>
				<div class={clsx(s.level, 'roboto-flex-700')}>lvl {props.upgrade.level}</div>
				<Price price={props.upgrade.price} fontSize={12} coinSize={20} class={clsx(!canBuy && s.imageGrayscale)} />
			</div>
		</div>
	);
};
