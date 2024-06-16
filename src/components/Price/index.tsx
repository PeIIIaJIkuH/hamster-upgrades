import { Component } from 'solid-js';
import coinIcon from '/icons/coin.png';
import s from './price.module.css';
import clsx from 'clsx';
import { compactNumberFormat } from '../../helpers';

type PriceProps = {
	price: number;
	coinSize: number;
	fontSize: number;
	class?: string;
};

export const Price: Component<PriceProps> = (props) => {
	return (
		<div class={clsx(s.price, props.class, 'roboto-flex-700')}>
			<img src={coinIcon} alt='coin' width={props.coinSize} height={props.coinSize} />
			<span style={{ 'font-size': `${props.fontSize}px` }}>{compactNumberFormat(props.price)}</span>
		</div>
	);
};
