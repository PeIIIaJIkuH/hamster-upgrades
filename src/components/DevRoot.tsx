import { Component } from 'solid-js';

import { Toaster } from '@/components';
import { HomePage } from '@/pages';

export const DevRoot: Component = () => {
	return (
		<>
			<Toaster />
			<HomePage />
		</>
	);
};
