import { Component, ParentProps } from 'solid-js';
import clsx from 'clsx';

import s from './title-card.module.css';

type TitleCardProps = {
	class?: string;
};

export const TitleCard: Component<ParentProps<TitleCardProps>> = (props) => {
	return <div class={clsx(props.class, s.titleCard, 'roboto-flex-700')}>{props.children}</div>;
};
