import { Component } from 'solid-js';
import { Toaster as SolidToaster } from 'solid-toast';

import { Icons } from '..';

import s from './toaster.module.css';

export const Toaster: Component = () => {
	return (
		<SolidToaster
			position='top-center'
			toastOptions={{ duration: 5000, className: s.toast, icon: <Icons.Check size={18} color='#82F88E' /> }}
		/>
	);
};
