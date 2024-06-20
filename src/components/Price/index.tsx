import { Component, Show } from 'solid-js';

import clsx from 'clsx';

import { numberFormat } from './helpers';

import s from './price.module.css';

import coinIcon from '/icons/coin.png';

type PriceProps = {
	price: number;
	coinSize?: number;
	fontSize: number;
	standard?: boolean;
	withPlus?: boolean;
	withoutDecimals?: boolean;
	separator?: string;
	class?: string;
};

export const Price: Component<PriceProps> = (props) => {
	return (
		<div class={clsx(s.price, props.class, 'roboto-flex-700')}>
			<Show when={props.coinSize}>
				<img src={coinIcon} alt='coin' width={props.coinSize} height={props.coinSize} />
			</Show>
			<span style={{ 'font-size': `${props.fontSize}px` }}>
				{props.withPlus && '+'}
				{numberFormat(props.price, props.standard, props.withoutDecimals, props.separator)}
			</span>
		</div>
	);
};
