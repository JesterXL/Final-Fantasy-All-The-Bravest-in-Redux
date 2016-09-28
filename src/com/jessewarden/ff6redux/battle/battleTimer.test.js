import {expect, assert, should } from 'chai';
should();

import { battleTimer, characterTick } from './battleTimer';

describe.only('#battleTimer', ()=>
{
	it('basic test', ()=>
	{
		expect(battleTimer).to.exist;
	});
	it('invoking works', ()=>
	{
		battleTimer().should.exist;
	});
	it('invoking gives you a generator', ()=>
	{
		battleTimer().next.should.exist;
	});
	it('calling the generator gives you a value', ()=>
	{
		battleTimer().next().should.exist;
	});
	it('calling the generator gives you a value', ()=>
	{
		battleTimer().next().should.exist;
	});
	// it('percentage has a value by default', function(done)
	// {
	// 	this.timeout(20 * 1000);
	// 	const gen = battleTimer();
	// });
});