/* @refresh reload */
import { render } from 'solid-js/web';
import { HomePage } from './pages';
import './index.css';

const root = document.getElementById('root');

if (!root) {
	throw new Error('No root element found');
}

render(() => <HomePage />, root);
