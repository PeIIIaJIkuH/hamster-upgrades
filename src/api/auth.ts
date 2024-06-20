import ky from 'ky';

import { store } from '../store';

const authApi = ky.create({
	prefixUrl: 'https://api.hamsterkombat.io/',
	hooks: {
		afterResponse: [
			async (_request, _options, response) => {
				if (response.status === 400) {
					store.setInitDataRaw('');
				}
			},
		],
	},
});

type AuthResponseSuccess = {
	status: string;
	authToken: string;
};

type AuthResponseError = {
	error_code: string;
};

type AuthResponse = AuthResponseSuccess | AuthResponseError;

export const isErrorResponse = (response: AuthResponse): response is AuthResponseError => 'error_code' in response;

export const authToHamster = async (initDataRaw: string) =>
	authApi
		.post('auth/auth-by-telegram-webapp', {
			json: {
				initDataRaw,
			},
		})
		.json<AuthResponse>();
