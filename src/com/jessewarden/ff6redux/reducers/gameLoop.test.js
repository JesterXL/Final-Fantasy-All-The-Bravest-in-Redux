import {expect, assert, should } from 'chai';
should();

import gameLoop from './gameLoop';
import {TICK, START_TIMER, STOP_TIMER} from '../core/actions';
import performance from '../core/perfnow';

describe('#gameLoop', ()=>
{
	it('basic test', ()=>
	{
		expect(gameLoop).to.exist;
	});
	it('should return a basic object', ()=>
	{
		gameLoop(undefined, {type: ""}).should.exist;
	});
	it("it's not running by default", ()=>
	{
		gameLoop(undefined, {type: ""}).running.should.be.false;
	});
	it('ticks make the time pass', ()=>
	{
		const starting = gameLoop(undefined, {type: ""});
		const newOne = gameLoop(starting, {type: TICK, now: performance.now()});
		newOne.now.should.be.above(starting.now);
	});
	it('start timer runs', ()=>
	{
		gameLoop(undefined, {type: START_TIMER}).running.should.be.true;
	});
	it('stop timer stops', ()=>
	{
		const first = gameLoop(undefined, {type: START_TIMER});
		gameLoop(first, {type: STOP_TIMER}).running.should.be.false;
	});
});