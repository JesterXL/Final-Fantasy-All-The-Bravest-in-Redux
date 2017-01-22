import {expect, assert, should } from 'chai';
should();
import _ from 'lodash';
import { 
	getRandomNumberFromRange,
	getDamageStep1,
	getRandomMonsterVigor,
	getDamageStep2,
	getDamageStep3,
	getDamageStep4,
	getCriticalHit,
	getDamageStep5,
	getDamageModificationsVariance,
	getDamageStep6,
	getDamageStep7,
	getDamageStep8,
	getDamageStep9,
	getHit
} from './BattleUtils';
const log = console.log;

describe.only('#BattleUtils', ()=>
{
	// it('divide', ()=>
	// {
	// 	const result = divide(2, 1);
    //     log("result:", 1);
    //     result.should.equal(1);
	// });
	it("getRandomNumberFromRange", ()=>
	{
		const result = getRandomNumberFromRange(1, 10);
		_.inRange(result, 1, 10).should.be.true;
	});
	it('getDamageStep1', ()=>
	{
		const result = getDamageStep1();
		// log("result:", result);
		result.should.be.at.least(1);
	});
	it('getRandomMonsterVigor', ()=>
	{
		getRandomMonsterVigor().should.be.within(56, 63);
	});
	it('getDamageStep2', ()=>
	{
		const result = getDamageStep2(1);
		// log("result:", result);
		result.should.be.at.least(1);
	});
	describe('#getDamageStep3', ()=>
	{
		it('by default leaves damage intact', ()=>
		{
			const result = getDamageStep3(2);
			result.should.equal(2);
		});
		it('if you are using magic and attacking multiple targets, it halves damage', ()=>
		{
			const result = getDamageStep3(2, true, true);
			result.should.equal(1);
		});
		it('using magic leaves damage intact', ()=>
		{
			const result = getDamageStep3(2, true);
			result.should.equal(2);
		});
	});
	describe('#getDamageStep4', ()=>
	{
		it('by default leaves damage intact', ()=>
		{
			getDamageStep4(2).should.equal(2);
		});
		it('halves damage if in back row', ()=>
		{
			const result = getDamageStep4(2, true);
			// log("wat:", result);
			result.should.equal(1);
		});
	});
	it('#getCriticalHit', ()=>
	{
		_.isBoolean(getCriticalHit()).should.be.true;
	});
	describe('#getDamageStep5', ()=>
	{
		it('leaves damage intact by default', ()=>
		{
			getDamageStep5(2).should.equal(2);
		});
		it('250% if morphed', ()=>
		{
			getDamageStep5(2, true).should.equal(5);
		});
		it('doubles if berserk and physical', ()=>
		{
			getDamageStep5(2, false, true).should.equal(4);
		});
		it('250% if critical hit', ()=>
		{
			getDamageStep5(2, false, false, true).should.equal(5);
		});
	});
	it('getDamageModificationsVariance', ()=>
	{
		getDamageModificationsVariance().should.be.within(224, 255);
	});
	describe('#getDamageStep6', ()=>
	{
		it('is higher by default', ()=>
		{
			const result = getDamageStep6(1);
			// log("default damage:", result);
			result.should.be.at.least(1);
		});
		it('safe reduces damage', ()=>
		{
			const result = getDamageStep6(1, 0, 0, 224, true, false, false, true);
			// log("safe damage:", result);
			result.should.be.at.least(1);
		});
		it('back row reduces damage', ()=>
		{
			const result = getDamageStep6(1, 0, 0, 224, true, false, false, true, false, false, true);
			// log("back row damage:", result);
			result.should.be.at.least(1);
		});
	});
	describe('#getDamageStep7', ()=>
	{
		it('default damage if not hitting back', ()=>
		{
			const result = getDamageStep7(1);
			result.should.be.at.least(1);
		});
		it('hitting back 150% damage', ()=>
		{
			const result = getDamageStep7(1, true, true);
			result.should.be.at.least(1.5);
		});
	});
	describe('#getDamageStep8', ()=>
	{
		it('no petrify default damage', ()=>
		{
			const result = getDamageStep8(1);
			result.should.equal(1);
		});
		it('petrified means no damage', ()=>
		{
			const result = getDamageStep8(1, true);
			result.should.equal(0);
		});
	});
	describe('#getDamageStep9', ()=>
	{
		it('defaults to same damage', ()=>
		{
			const result = getDamageStep9(1);
			result.should.equal(1);
		});
		it('sets damage to 0 if nullified element', ()=>
		{
			const result = getDamageStep9(1, true);
			result.should.equal(0);
		});
	});
	describe('#getHit', ()=>
	{
		it('should hit if 99 roll and stamnia roll 127', ()=>
		{
			getHit(99, 127).hit.should.be.true;
		});
		it('should miss if 0 roll and stamnia roll 0', ()=>
		{
			getHit(0, 0).hit.should.be.true;
		});
	});
	
});