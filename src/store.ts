import { createEffect, createRoot, createSignal } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

import { authToHamster, isErrorResponse } from './api/auth';
import { app, useAuth } from './firebase';
import { LOCAL_STORAGE_KEY } from './constants';
import { retrieveLaunchParams } from '@tma.js/sdk-solid';

export const store = createRoot(() => {
	const [initDataRaw, setInitDataRaw] = makePersisted(createSignal(''), { name: LOCAL_STORAGE_KEY.INIT_DATA_RAW });
	const [authToken, setAuthToken] = makePersisted(createSignal(''), { name: LOCAL_STORAGE_KEY.AUTH_TOKEN });
	const [authTokenLoading, setAuthTokenLoading] = createSignal(true);
	const { initData } = retrieveLaunchParams();

	const db = getFirestore(app);
	const authState = useAuth(app);

	createEffect(async () => {
		if ((!authToken() && !initDataRaw()) || authToken()) {
			setAuthTokenLoading(false);
			return;
		}
		store.setAuthTokenLoading(true);
		const response = await authToHamster(initDataRaw());
		store.setAuthTokenLoading(false);
		if (isErrorResponse(response)) {
			setInitDataRaw('');
		} else {
			setAuthToken(response.authToken);
		}
	});

	createEffect(async () => {
		if (!initData?.user?.id) {
			return;
		}
		const docRef = doc(db, 'users', String(initData.user.id));
		setAuthTokenLoading(true);
		const docSnap = await getDoc(docRef);
		setAuthTokenLoading(false);

		if (!initDataRaw() && docSnap.data()?.initDataRaw) {
			setInitDataRaw(docSnap.data()?.initDataRaw);
		}
		if (initDataRaw()) {
			await setDoc(docRef, { initDataRaw: initDataRaw(), from: authState.user?.uid });
		}
	});

	return {
		initDataRaw,
		setInitDataRaw,
		authToken,
		setAuthToken,
		authTokenLoading,
		setAuthTokenLoading,
	};
});
