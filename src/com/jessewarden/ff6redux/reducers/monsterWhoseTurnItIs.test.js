import {expect, assert, should } from 'chai';
should();

import monsterWhoseTurnItIs from './monsterWhoseTurnItIs';
import { MONSTER_TURN, MONSTER_TURN_OVER } from '../core/actions';
import {noMonster} from './startState';

describe('#monsterWhoseTurnItIs', ()=>
{
	it('basic test', ()=>
	{
		expect(monsterWhoseTurnItIs).to.exist;
	});
	it('should return noMonster by default', ()=>
	{
		monsterWhoseTurnItIs(undefined, {type: ""}).should.equal(noMonster);
	});
	it("if monster's turn, we should get it", ()=>
	{
		const sup = {id: 'moo'};
		monsterWhoseTurnItIs(undefined, {
			type: MONSTER_TURN,
			monster: sup
		}).id.should.equal('moo');
	});
	it('should go back to no monster at turn end', ()=>
	{
		const first = monsterWhoseTurnItIs(undefined, {
			type: MONSTER_TURN,
			monster: {}
		});
		monsterWhoseTurnItIs(first, {type: MONSTER_TURN_OVER}).should.equal(noMonster);
	});
});