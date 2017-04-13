import {expect, assert, should } from 'chai';
should();
import _ from 'lodash';
import KeyboardManager from './KeyboardManager';

import { createStore, applyMiddleware, combineReducers} from 'redux'

describe('#KeyboardManager', ()=>
{
	it('works with emulated event', (done)=>
	{
		var key = new KeyboardManager();
		key.changes.subscribe((e)=>
		{
			e.should.exist;
			done();
		});
		window.dispatchEvent(new Event('keydown'));
	});
	it('destroy ensures no more events', (done)=>
	{
		var key = new KeyboardManager();
		key.changes.subscribe((e)=>
		{
			done(new Error('should not get events'));
		});
		key.destroy();
		window.dispatchEvent(new Event('keydown'));
		done();
	});
});
