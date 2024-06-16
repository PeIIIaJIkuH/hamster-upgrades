import { createSignal } from 'solid-js';

import { LOCAL_STORAGE_KEY } from './constants';
import { createLocalStorageSignal } from './helpers';

export const [initDataRaw, setInitDataRaw] = createSignal<string | null>(
	new URLSearchParams(window.location.search).get('initDataRaw'),
);

export const [authToken, setAuthToken] = createLocalStorageSignal<string>(LOCAL_STORAGE_KEY.AUTH_TOKEN, '');
