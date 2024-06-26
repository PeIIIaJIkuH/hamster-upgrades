import { createEffect, createRoot, createSignal } from 'solid-js';

import { makePersisted } from '@solid-primitives/storage';
import { retrieveLaunchParams } from '@tma.js/sdk-solid';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

import { authToHamster, isErrorResponse } from '@/api/auth';
import { LOCAL_STORAGE_KEY } from '@/constants';
import { app, useAuth } from '@/firebase';

export const store = createRoot(() => {
	const [initDataRaw, setInitDataRaw] = makePersisted(createSignal(''), { name: LOCAL_STORAGE_KEY.INIT_DATA_RAW });
	const [authToken, setAuthToken] = makePersisted(createSignal(''), { name: LOCAL_STORAGE_KEY.AUTH_TOKEN });
	const [authTokenLoading, setAuthTokenLoading] = createSignal(true);

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
		let userId: string | null = null;
		if (import.meta.env.DEV) {
			userId = 'telegram_user_id';
		} else {
			const { initData } = retrieveLaunchParams();
			userId = initData?.user?.id ? String(initData.user.id) : null;
		}
		if (!userId) {
			return;
		}
		const docRef = doc(db, 'users', userId);
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
