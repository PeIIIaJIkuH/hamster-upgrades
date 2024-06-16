import { HANDLE_400_AS_401, api } from '.';

export type Upgrade = {
	id: string;
	name: string;
	price: number;
	profitPerHour: number;
	condition?: Condition;
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

type Condition = {
	_type: string;
	moreReferralsCount?: number;
	upgradeId?: string;
	level?: number;
	link?: string;
	channelId?: number;
	subscribeLink?: string;
	links?: string[];
	referralCount?: number;
};

type Section = {
	section: string;
	isAvailable: boolean;
};

type DailyCombo = {
	upgradeIds: string[];
	bonusCoins: number;
	isClaimed: boolean;
	remainSeconds: number;
};

type Response = {
	upgradesForBuy: Upgrade[];
	sections: Section[];
	dailyCombo: DailyCombo;
};

export const fetchUpgrades = async () => {
	const response = api.post('clicker/upgrades-for-buy', { headers: { [HANDLE_400_AS_401]: 'true' } });
	return await response.json<Response>();
};
