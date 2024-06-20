import { Component, ErrorBoundary, Match, Switch } from 'solid-js';

import { SDKProvider, retrieveLaunchParams } from '@tma.js/sdk-solid';
import eruda from 'eruda';

import { Toaster } from '@/components';

import { App } from './App';

const Inner: Component = () => {
	const { startParam } = retrieveLaunchParams();
	const debug = startParam === 'debug';
	if (debug) {
		eruda.init();
	}

	return (
		<SDKProvider acceptCustomStyles debug={debug}>
			<Toaster />
			<App />
		</SDKProvider>
	);
};

export const Root: Component = () => {
	return (
		<ErrorBoundary
			fallback={(err) => {
				console.error('ErrorBoundary handled error:', err);

				return (
					<div>
						<p>ErrorBoundary handled error:</p>
						<blockquote>
							<code>
								<Switch fallback={JSON.stringify(err)}>
									<Match when={typeof err === 'string' ? err : false}>{(v) => v()}</Match>
									<Match when={err instanceof Error ? err.message : false}>{(v) => v()}</Match>
								</Switch>
							</code>
						</blockquote>
					</div>
				);
			}}
		>
			<Inner />
		</ErrorBoundary>
	);
};
