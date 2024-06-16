import { createEffect, createSignal } from 'solid-js';
import { LOCAL_STORAGE_KEY } from '../constants';

export const createLocalStorageSignal = <T>(key: LOCAL_STORAGE_KEY, defaultValue: T) => {
	const initialValue = JSON.parse(localStorage.getItem(key) ?? 'null') || defaultValue;

	const [signal, setSignal] = createSignal(initialValue);

	createEffect(() => {
		localStorage.setItem(key, JSON.stringify(signal()));
	});

	return [signal, setSignal] as const;
};
