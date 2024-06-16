import { LOCAL_STORAGE_KEY } from './constants';
import { createLocalStorageSignal } from './helpers';

export const [initDataRaw, setInitDataRaw] = createLocalStorageSignal<string>(LOCAL_STORAGE_KEY.INIT_DATA_RAW, '');

export const [authToken, setAuthToken] = createLocalStorageSignal<string>(LOCAL_STORAGE_KEY.AUTH_TOKEN, '');
