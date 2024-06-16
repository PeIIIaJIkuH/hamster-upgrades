import { Component } from 'solid-js';

import { HomePage } from '../pages/home';

type Route = {
	path: string;
	Component: Component;
	title?: string;
};

export const routes: Route[] = [{ path: '/', Component: HomePage }];
