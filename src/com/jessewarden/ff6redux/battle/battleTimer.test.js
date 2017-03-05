import {expect, assert, should } from 'chai';
should();
const log = console.log;

import {
	battleTimer,
	characterTick,
	tickerBrowser,
	timer
} from './battleTimer';

describe('#battleTimer', ()=>
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
	it('calling the generator gives you a percentage', (done)=>
	{
		// var result = battleTimer();
		// console.log("result1:", result.next(10));
		// console.log("result2:", result.next());
		// console.log("result3:", result.next(30));
		// battleTimer().next().percentage.should.exist;
	
		// const gen = tickerBrowser();
		// log("result1:", gen.next().value);
		// log("result2:", gen.next().value);
		// setTimeout(()=>
		// {
		// 	log("result3:", gen.next().value);
		// 	done();
		// }, 1000);

		done();
	});
	it('calling the generator gives you a gauge', ()=>
	{
		battleTimer().next().gauge.should.exist;
	});
	// it('percentage has a value by default', function(done)
	// {
	// 	this.timeout(20 * 1000);
	// 	const gen = battleTimer();
	// });
});
describe('#timer', ()=>
{
	it('works', (done)=>
	{
		const result = timer();
		log("result1:", result.next());
		log("result2:", result.next());
		setTimeout(()=>
		{
			log("result1:", result.next());
			done();
		}, 1000);
	});
});