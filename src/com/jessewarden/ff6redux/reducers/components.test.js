import {expect, assert, should } from 'chai';
should();

import { 
	ADD_COMPONENT, 
	REMOVE_COMPONENT, 
	TICK,
	CHARACTER_HITPOINTS_CHANGED,
	PLAYER_TURN_OVER,
	CHARACTER_DEAD
} from '../core/actions';

import { 
	components,
	processCharacterBattleTimers
} from './components';
import { Character, makeBattleTimer } from '../battle/Character';

describe.only('#components', ()=>
{
	it('basic test', ()=>
	{
		expect(components).to.exist;
	});
	describe('#components', ()=>
	{
		it('ADD adds it', ()=>
		{
			var entity = 'moo';
			var component = {entity};
			components([], {type: ADD_COMPONENT, entity}).should.have.lengthOf(1);
		});
		it('REMOVE removes it', ()=>
		{	
			var entity = 'moo';
			var component = {entity};
			components([component], {type: REMOVE_COMPONENT, component}).should.have.lengthOf(0);
		});
		it("processCharacterBattleTimers noop with empty array", ()=>
		{
			processCharacterBattleTimers([], {type: TICK}).should.have.lengthOf(0);
		});
		it('processCharacterBattleTimers noop with array not full of Characters', ()=>
		{
			processCharacterBattleTimers([{}, {type: 'cow'}], {type: TICK}).should.have.lengthOf(2);
		});
		it('processCharacterBattleTimers works with Characters', ()=>
		{
			var list = [{
				type: 'Character',
				generator:makeBattleTimer({speed: 10}),
				percentage: 0
			}];
			var action = {
				type: TICK,
				difference: 2 * 1000
			};
			processCharacterBattleTimers(list, action)[0].percentage.should.be.above(0);
		});
	});
	
	
});