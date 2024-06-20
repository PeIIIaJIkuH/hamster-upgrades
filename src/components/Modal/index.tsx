import { Accessor, JSX, Show, mergeProps } from 'solid-js';

import { createPresence } from '@solid-primitives/presence';
import clsx from 'clsx';
import { Portal } from 'solid-js/web';

import { Icons } from '@/components';

import s from './modal.module.css';

type ModalProps<T> = {
	item: Accessor<T>;
	onAction: (item: T) => void;
	onClose: () => void;
	buttonLabel: string;
	duration?: number;
	isActionDisabled?: (item: T) => boolean;
	children: (item: Accessor<NonNullable<T>>) => JSX.Element;
};

export function Modal<T>(props: ModalProps<T>): JSX.Element {
	const merged = mergeProps({ duration: 500 }, props);
	const { mountedItem, isVisible } = createPresence(merged.item, {
		transitionDuration: merged.duration,
	});

	const handleAction = () => {
		merged.onAction(merged.item());
		merged.onClose();
	};

	const isDisabled = () => merged.isActionDisabled?.(merged.item()) ?? false;

	return (
		<Show when={mountedItem()}>
			{(item) => (
				<Portal>
					<div
						class={s.modal}
						style={{
							'pointer-events': isVisible() ? 'auto' : 'none',
						}}
					>
						<div
							class={s.overlay}
							onClick={merged.onClose}
							style={{
								opacity: isVisible() ? 1 : 0,
								transition: `opacity ${merged.duration}ms`,
							}}
						/>
						<div
							class={s.content}
							style={{
								transform: `translateY(${isVisible() ? 0 : 150}%)`,
								transition: `transform ${merged.duration}ms`,
							}}
						>
							<div class={s.close} onClick={merged.onClose}>
								<Icons.Close height={32} width={32} />
							</div>
							<div class={s.inner}>
								{merged.children(item)}
								<button class={clsx(s.action, 'roboto-flex-600')} disabled={isDisabled()} onClick={handleAction}>
									{merged.buttonLabel}
								</button>
							</div>
						</div>
					</div>
				</Portal>
			)}
		</Show>
	);
}
