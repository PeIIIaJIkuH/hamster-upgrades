import ky from 'ky';

import { notifyError } from '@/components';
import { store } from '@/store';

import { authToHamster, isErrorResponse } from './auth';

export const HANDLE_400_AS_401 = 'X-Custom-Handle-400-As-401';

export const api = ky.create({
	prefixUrl: 'https://api.hamsterkombat.io/',
	hooks: {
		afterResponse: [
			async (request, _options, response) => {
				if (!response.ok) {
					notifyError('Something went wrong');
				}
				if (response.status === 401 || (response.status === 400 && request.headers.get(HANDLE_400_AS_401) === 'true')) {
					store.setAuthToken('');
					const initData = store.initDataRaw();
					if (initData) {
						store.setAuthTokenLoading(true);
						const res = await authToHamster(initData);
						store.setAuthTokenLoading(false);
						if (isErrorResponse(res)) {
							return response;
						}
						const { authToken: token } = res;
						store.setAuthToken(token);
						request.headers.set('Authorization', `Bearer ${token}`);
						return ky(request);
					}
				}
				store.setAuthTokenLoading(false);
				return response;
			},
		],
	},
});

export * from './clicker';
