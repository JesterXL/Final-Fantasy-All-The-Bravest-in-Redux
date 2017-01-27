import {expect, assert, should } from 'chai';
should();
import _ from 'lodash';
import { 
	getCharacter,
    makePlayer,
    makeReadyCharacter,
    equippedWithNoRelics
} from './Character';
import {getAtlasArmletRelic} from '../relics';
import BattleState from '../enums/BattleState';
const log = console.log;
const getOnePlayer = _.partial(makePlayer, '1');

describe.only('#Character', ()=>
{
    it('#getCharacter', ()=>
    {
        getCharacter('1').should.exist;
    });
    it('#makePlayer where entity matches', ()=>
    {
        const player = getOnePlayer();
        player.entity.should.equal('1');
    });
    describe('#battle state', ()=>
    {
        it('default character is not ready', ()=>
        {
            const player = getOnePlayer();
            player.battleState.should.not.equal(BattleState.READY);
        });
        it("if you make 'em ready, they ready", ()=>
        {
            const player = makeReadyCharacter('1');
            player.battleState.should.equal(BattleState.READY);
        });
    });
    describe('#equippedWithNoRelics', ()=>
    {
        it('true by default', ()=>
        {
            const player = getOnePlayer();
            equippedWithNoRelics(player).should.be.true;
        });
        it('false once you equip one', ()=>
        {
            const player = getOnePlayer();
            const relic = getAtlasArmletRelic();
            player.relic1 = relic; 
            equippedWithNoRelics(player).should.be.false;
        });
    });
});