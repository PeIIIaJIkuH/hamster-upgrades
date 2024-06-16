/* @refresh reload */
import { render } from 'solid-js/web';

import { Root } from './components/Root';

import './index.css';

const root = document.getElementById('root');

if (!root) {
	throw new Error('No root element found');
}

render(() => <Root />, root);
