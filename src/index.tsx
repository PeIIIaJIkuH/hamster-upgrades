/* @refresh reload */
import { render } from 'solid-js/web';

import { DevRoot } from './components/DevRoot';
import { Root } from './components/Root';

import './index.css';

const root = document.getElementById('root');

if (!root) {
	throw new Error('No root element found');
}

if (import.meta.env.DEV) {
	render(() => <DevRoot />, root);
} else {
	render(() => <Root />, root);
}
