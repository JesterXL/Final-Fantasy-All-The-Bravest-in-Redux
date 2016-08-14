import 'babel-polyfill';
import {setupRedux} from './main';

export function Application()
{
	setupRedux();
}

Application();