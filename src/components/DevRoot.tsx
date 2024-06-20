import { Component } from 'solid-js';

import { Toaster } from '.';
import { HomePage } from '../pages/home';

export const DevRoot: Component = () => {
	return (
		<>
			<Toaster />
			<HomePage />
		</>
	);
};
