import { HANDLE_400_AS_401, api } from '.';

type ErrorResponse = {
	error_code: string;
};

export type Upgrade = {
	id: string;
	name: string;
	price: number;
	profitPerHour: number;
	section: string;
	level: number;
	currentProfitPerHour: number;
	profitPerHourDelta: number;
	isAvailable: boolean;
	isExpired: boolean;
	cooldownSeconds?: number;
	totalCooldownSeconds?: number;
	expiresAt?: string;
	maxLevel?: number;
	welcomeCoins?: number;
};

export type DailyCombo = {
	upgradeIds: string[];
	bonusCoins: number;
	isClaimed: boolean;
	remainSeconds: number;
};

export type UpgradesState = {
	upgradesForBuy: Upgrade[];
	dailyCombo: DailyCombo;
};

export type SyncState = {
	clickerUser: {
		availableTaps: number;
		balanceCoins: number;
		earnPassivePerHour: number;
		earnPassivePerSec: number;
		earnPerTap: number;
		level: number;
		maxTaps: number;
		tapsRecoverPerSec: number;
	};
};

export type DailyCipher = {
	cipher: string;
	isClaimed: boolean;
};

export type ConfigState = {
	clickerConfig: {
		userLevels_balanceCoins: {
			level: number;
			coinsToLeveUp: number | null;
		}[];
	};
	dailyCipher: DailyCipher;
};

export const isErrorResponse = (response: ErrorResponse | SyncState): response is ErrorResponse =>
	'error_code' in response;

export const fetchUpgrades = async (authToken: string) => {
	const response = api.post('clicker/upgrades-for-buy', {
		headers: {
			[HANDLE_400_AS_401]: 'true',
			Authorization: `Bearer ${authToken}`,
		},
	});
	return await response.json<UpgradesState>();
};

export const buyUpgrade = async (authToken: string, upgrade: Upgrade) => {
	const response = api.post('clicker/buy-upgrade', {
		json: {
			upgradeId: upgrade.id,
			timestamp: Date.now(),
		},
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return await response.json<UpgradesState>();
};

export const claimDailyCombo = async (authToken: string) => {
	const response = await api.post('clicker/claim-daily-combo', {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return await response.json<SyncState>();
};

export const claimDailyCipher = async (authToken: string, cipher: string) => {
	const response = await api.post('clicker/claim-daily-cipher', {
		json: {
			cipher: window.atob(cipher),
		},
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return await response.json<SyncState | ErrorResponse>();
};

export const fetchSync = async (authToken: string) => {
	const response = api.post('clicker/sync', {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return await response.json<SyncState>();
};

export const fetchConfig = async (authToken: string) => {
	const response = api.post('clicker/config', {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return await response.json<ConfigState>();
};

export const sendTaps = async (authToken: string, count: number, availableTaps: number) => {
	const response = await api.post('clicker/tap', {
		json: {
			count,
			availableTaps,
			timestamp: Date.now(),
		},
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return await response.json<SyncState>();
};
