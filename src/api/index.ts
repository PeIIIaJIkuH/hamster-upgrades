import ky from 'ky';
import { authToHamster } from './authToHamster';
import { authToken, initDataRaw, setAuthToken } from '../store';

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
					if (initDataRaw()) {
						const authToken = await authToHamster(initDataRaw());
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
