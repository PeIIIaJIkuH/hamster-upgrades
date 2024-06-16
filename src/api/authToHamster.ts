import ky from 'ky';

import { setInitDataRaw } from '../store';

const authApi = ky.create({
	prefixUrl: 'https://api.hamsterkombat.io/',
	hooks: {
		afterResponse: [
			async (_request, _options, response) => {
				if (response.status === 400) {
					setInitDataRaw('');
				}
			},
		],
	},
});

type Response = {
	status: string;
	authToken: string;
};

export const authToHamster = async (initDataRaw: string) => {
	const { authToken } = await authApi
		.post('auth/auth-by-telegram-webapp', {
			json: {
				initDataRaw,
			},
		})
		.json<Response>();

	return authToken;
};
