import ky from 'ky';

import { authToken, initDataRaw, setAuthToken } from '../store';
import { authToHamster } from './authToHamster';

export const HANDLE_400_AS_401 = 'X-Custom-Handle-400-As-401';

export const api = ky.create({
	prefixUrl: 'https://api.hamsterkombat.io/',
	hooks: {
		beforeRequest: [
			(request) => {
				request.headers.set('Authorization', `Bearer ${authToken()}`);
				return request;
			},
		],
		afterResponse: [
			async (request, _options, response) => {
				if (response.status === 401 || (response.status === 400 && request.headers.get(HANDLE_400_AS_401) === 'true')) {
					setAuthToken('');
					const initData = initDataRaw();
					if (initData) {
						const authToken = await authToHamster(initData);
						setAuthToken(authToken);
						request.headers.set('Authorization', `Bearer ${authToken}`);
						return ky(request);
					}
				}
				return response;
			},
		],
	},
});

export { fetchUpgrades } from './fetchUpgrades';
