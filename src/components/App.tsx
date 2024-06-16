import {
	bindMiniAppCSSVars,
	bindThemeParamsCSSVars,
	bindViewportCSSVars,
	initNavigator,
	useMiniApp,
	useThemeParams,
	useViewport,
} from '@tma.js/sdk-solid';
import { createRouter } from '@tma.js/solid-router-integration';
import { Component, For, createEffect, onCleanup } from 'solid-js';
import { routes } from '../navigation/routes';
import { Navigate, Route } from '@solidjs/router';

export const App: Component = () => {
	const miniApp = useMiniApp();
	const themeParams = useThemeParams();
	const viewport = useViewport();

	createEffect(() => {
		onCleanup(bindMiniAppCSSVars(miniApp(), themeParams()));
	});
	createEffect(() => {
		onCleanup(bindThemeParamsCSSVars(themeParams()));
	});
	createEffect(() => {
		const vp = viewport();
		vp && onCleanup(bindViewportCSSVars(vp));
	});

	const navigator = initNavigator('app-navigator-state');
	void navigator.attach();

	onCleanup(() => {
		navigator.detach();
	});

	const Router = createRouter(navigator);

	return (
		<Router>
			<For each={routes}>{(route) => <Route path={route.path} component={route.Component} />}</For>
			<Route path='*' component={() => <Navigate href='/' />} />
		</Router>
	);
};
