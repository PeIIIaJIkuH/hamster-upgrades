import { Component } from 'solid-js';

import toast, { Toaster as SolidToaster } from 'solid-toast';

import { Icons } from '@/components';

import s from './toaster.module.css';

export const Toaster: Component = () => {
	return (
		<SolidToaster
			position='top-center'
			toastOptions={{
				duration: 5000,
				className: s.toast,
			}}
		/>
	);
};

export const notifySuccess = (message: string) => {
	toast.success(message, {
		icon: <Icons.Check height={18} width={18} color='#82F88E' />,
	});
};

export const notifyError = (message: string) => {
	toast.error(message, {
		icon: <Icons.Close height={18} width={18} color='#FF7777' />,
	});
};
