/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import { Root } from './components/Root';

const root = document.getElementById('root');

if (!root) {
	throw new Error('No root element found');
}

render(() => <Root />, root);
