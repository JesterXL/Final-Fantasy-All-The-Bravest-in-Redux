import {expect, assert, should } from 'chai';
should();

import playerWhoseTurnItIs from './playerWhoseTurnItIs';
import { PLAYER_TURN, PLAYER_TURN_OVER } from '../core/actions';
import {noPlayer} from './startState';

describe('#playerWhoseTurnItIs', ()=>
{
	it('basic test', ()=>
	{
		expect(playerWhoseTurnItIs).to.exist;
	});
	it('should return noPlayer by default', ()=>
	{
		playerWhoseTurnItIs(undefined, {type: ""}).should.equal(noPlayer);
	});
	it("if players's turn, we should get it", ()=>
	{
		const sup = {id: 'moo'};
		playerWhoseTurnItIs(undefined, {
			type: PLAYER_TURN,
			player: sup
		}).id.should.equal('moo');
	});
	it('should go back to no player at turn end', ()=>
	{
		const first = playerWhoseTurnItIs(undefined, {
			type: PLAYER_TURN,
			player: {}
		});
		playerWhoseTurnItIs(first, {type: PLAYER_TURN_OVER}).should.equal(noPlayer);
	});
});