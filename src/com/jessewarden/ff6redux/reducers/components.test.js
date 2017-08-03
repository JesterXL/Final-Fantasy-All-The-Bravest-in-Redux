// import {expect, assert, should } from 'chai';
// should();

// import { 
// 	ADD_COMPONENT, 
// 	REMOVE_COMPONENT, 
// 	TICK,
// 	CHARACTER_HITPOINTS_CHANGED,
// 	PLAYER_TURN_OVER,
// 	CHARACTER_DEAD
// } from '../core/actions';
// import { genericEntity } from '../enums/entities';
// import BattleState from '../enums/BattleState';

// import { 
// 	components,
// 	processCharacterBattleTimers,
// 	characterHitPointsChanged,
// 	characterDead
// } from './components';
// import { getCharacter, makeBattleTimer } from '../battle/Character';

// describe('#components', ()=>
// {
// 	it('basic test', ()=>
// 	{
// 		expect(components).to.exist;
// 	});
// 	describe('#components', ()=>
// 	{
// 		describe('#add', ()=>
// 		{
// 			it('ADD adds it', ()=>
// 			{
// 				var entity = 'moo';
// 				var component = {entity};
// 				components([], {type: ADD_COMPONENT, entity}).should.have.lengthOf(1);
// 			});
// 			it('REMOVE removes it', ()=>
// 			{	
// 				var entity = 'moo';
// 				var component = {entity};
// 				components([component], {type: REMOVE_COMPONENT, component}).should.have.lengthOf(0);
// 			});
// 		});
// 		describe('#processCharacterBattleTimers', ()=>
// 		{
// 			it("processCharacterBattleTimers noop with empty array", ()=>
// 			{
// 				processCharacterBattleTimers([], {type: TICK}).should.have.lengthOf(0);
// 			});
// 			it('processCharacterBattleTimers noop with array not full of Characters', ()=>
// 			{
// 				processCharacterBattleTimers([{}, {type: 'cow'}], {type: TICK}).should.have.lengthOf(2);
// 			});
// 			it('processCharacterBattleTimers works with Characters', ()=>
// 			{
// 				var list = [{
// 					type: 'Character',
// 					generator:makeBattleTimer({speed: 10}),
// 					percentage: 0
// 				}];
// 				var action = {
// 					type: TICK,
// 					difference: 2 * 1000
// 				};
// 				processCharacterBattleTimers(list, action)[0].percentage.should.be.above(0);
// 			});
// 		});
// 		describe('#CHARACTER_HITPOINTS_CHANGED', ()=>
// 		{
// 			const entity = genericEntity();
// 			const character = getCharacter(entity);
// 			const changeCharacterHitPoints = (character, value) => {
// 				return {
// 					type: CHARACTER_HITPOINTS_CHANGED,
// 					character: character,
// 					hitPoints: value
// 				};
// 			};
// 			it('decrements hitpoints', ()=>
// 			{
// 				characterHitPointsChanged([character], changeCharacterHitPoints(character, 5))[0].hitPoints.should.equal(5);
// 			});
// 			it('increments hitpoints', ()=>
// 			{
// 				characterHitPointsChanged([character], changeCharacterHitPoints(character, 12))[0].hitPoints.should.equal(12);
// 			});
// 			it('character returned is new', ()=>
// 			{
// 				characterHitPointsChanged([character], changeCharacterHitPoints(character, 5))[0].should.not.equal(character);
// 			});
// 			it('should not change components length', ()=>
// 			{
// 				const list = [character];
// 				const newList = characterHitPointsChanged(list, changeCharacterHitPoints(character, 5));
// 				newList.length.should.equal(1);
// 			});
// 		});
// 		describe('#CHARACTER_DEAD', ()=>
// 		{
// 			const entity = genericEntity();
// 			it('starts in waiting', ()=>
// 			{
// 				const character = getCharacter(entity); 
// 				character.battleState.should.equal(BattleState.WAITING);
// 			});
// 			it('ends in death', ()=>
// 			{
// 				const character = getCharacter(entity); 
// 				characterDead([character], {character, type: CHARACTER_DEAD})[0].battleState.should.equal(BattleState.DEAD);
// 			});
// 		});
// 	});
// });