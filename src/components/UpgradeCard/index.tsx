import { Component } from 'solid-js';
import clsx from 'clsx';

import { Upgrade } from '../../api';
import { Image, Price } from '..';

import s from './upgrade-card.module.css';

type UpgradeProps = {
	upgrade: Upgrade;
	onClick: (upgrade: Upgrade) => void;
};

export const UpgradeCard: Component<UpgradeProps> = (props) => {
	return (
		<div class={s.upgradeCard} onClick={[props.onClick, props.upgrade]}>
			<div class={s.top}>
				<div class={s.image}>
					<Image id={props.upgrade.id} alt={props.upgrade.name} size={60} />
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
						/>
					</div>
				</div>
			</div>
			<div class={s.bottom}>
				<div class={clsx(s.level, 'roboto-flex-700')}>lvl {props.upgrade.level}</div>
				<Price price={props.upgrade.price} fontSize={12} coinSize={20} />
			</div>
		</div>
	);
};
