import {expect, assert, should } from 'chai';
should();
import _ from 'lodash';
import { 
	divide,
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
	getHit,
	getHitAndApplyDamage,
	step4e,
	getHitDefaultGetHitOptions,
	getDefaultDamageOptions,
	getDamage
} from './BattleUtils';
const log = console.log;

import jsverify from 'jsverify';
import { property, integer } from 'jsverify';

describe('#BattleUtils', ()=>
{
	it('divide', ()=>
	{
		const result = divide(10, 2);
        result.should.equal(5);
	});
	property("divide is never NaN", integer, integer, (i, n) =>
	{
		return _.isNaN(divide(i, n)) === false;
	});
	it("getRandomNumberFromRange", ()=>
	{
		const result = getRandomNumberFromRange(1, 10);
		_.inRange(result, 1, 10).should.be.true;
	});
	property("divide is never NaN", 'integer 1 10', max =>
	{
		const result = getRandomNumberFromRange(1, max);
		return result >= 1 && result <= max;
	});
	describe("#getDamageStep1", ()=>
	{
		it('default is 0', ()=>
		{
			getDamageStep1().should.equal(0);
		});
		it('255 vigor is 0', ()=>
		{
			getDamageStep1(255).should.equal(0);
		});
		it('99 level is 0', ()=>
		{
			getDamageStep1(0, 0, 0, 0, 99).should.equal(0);
		});
		it('minimum of 1 for vigor, level, and battlepower to get any damage', ()=>
		{
			getDamageStep1(1, 1, 0, 0, 1).should.be.at.least(1);
		});
		it('high vigor helps', ()=>
		{
			getDamageStep1(255, 1, 0, 0, 1).should.be.at.least(2);
		});
		it('high level helps more', ()=>
		{
			getDamageStep1(1, 1, 0, 0, 99).should.be.at.least(173);
		});
		it('battle power helps the most', ()=>
		{
			getDamageStep1(1, 255, 0, 0, 1).should.be.at.least(256);
		});
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
			const result = getDamageStep3(2)
			result.should.equal(2);
		});
		it('if you are using magic and attacking multiple targets, it halves damage', ()=>
		{
			const result = getDamageStep3(2, false, true);
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
	describe("#step4e", ()=>
	{
		it('0 magic block results in 255', ()=>
		{
			step4e(0).should.equal(255);
		});
		it('255 magic block results in 0', ()=>
		{
			step4e(255).should.equal(1);
		});
	});
	describe('#getHit', ()=>
	{
		let options;
		beforeEach(()=>
		{
			options = getHitDefaultGetHitOptions();
		});
		it('1 hitRate always misses', ()=>
		{
			options.randomHitOrMissValue = 99;
			options.hitRate = 1;
			getHit(options).hit.should.be.false;
		});
		it('hit rate of 254 still hits everytime with default values', ()=>
		{
			options.randomHitOrMissValue = 99;
			options.hitRate = 254;
			getHit(options).hit.should.be.true;
		});
		it('perfect hit rate of 255 always hits', ()=>
		{
			options.randomHitOrMissValue = 255;
			options.hitRate = 255;
			getHit(options).hit.should.be.true;
		});
		it('hitting clear status always fails', ()=>
		{
			options.targetHasClearStatus = true;
			getHit(options).hit.should.be.false;
		});
		it('magic against clear status always succeeds', ()=>
		{
			options.targetHasClearStatus = true;
			options.isPhysicalAttack = false;
			getHit(options).hit.should.be.true;
		});
		it('wound protected targets are missed by death protected attacks', ()=>
		{
			options.protectedFromWound = true;
			options.attackMissesDeathProtectedTargets = true;
			getHit(options).hit.should.be.false;
		});
		it('unblockable spells always hit', ()=>
		{
			options.isPhysicalAttack = false;
			options.spellUnblockable = true;
			getHit(options).hit.should.be.true;
		});
		it('targets asleep always get hit', ()=>
		{
			options.targetHasSleepStatus = true;
			getHit(options).hit.should.be.true;
		});
		it('targets petrified always get hit', ()=>
		{
			options.targetHasPetrifyStatus = true;
			getHit(options).hit.should.be.true;
		});
		it('targets frozen always get hit', ()=>
		{
			options.targetHasFreezeStatus = true;
			getHit(options).hit.should.be.true;
		});
		it('targets stopped always get hit', ()=>
		{
			options.targetHasStopStatus = true;
			getHit(options).hit.should.be.true;
		});
		it('targets with back turned always get hit', ()=>
		{
			options.backOfTarget = true;
			getHit(options).hit.should.be.true;
		});
		it('targets with image status always are missed', ()=>
		{
			options.targetHasImageStatus = true;
			getHit(options).hit.should.be.false;
		});
		it('high stamina blocks Break if a regular hit', ()=>
		{
			options.randomStaminaHitOrMissValue = 127;
			options.specialAttackType = 'Break';
			options.randomHitOrMissValue = 0;
			options.hitRate = 254;
			options.targetStamina = 255;
			getHit(options).hit.should.be.false;
		});
	});
	describe('#getDamage', ()=>
	{
		let options;
		let attacker;
		let getDefaultDamage;
		beforeEach(()=>
		{
			attacker = {
				vigor: 1,
				level: 1,
				battlePower: 1
			};
			const getCriticalHitFunction = ()=> false;
			const getDamageModificationsVarianceFunction = ()=> 224;
			options = getDefaultDamageOptions(attacker, getCriticalHitFunction, getDamageModificationsVarianceFunction);
			getDefaultDamage = _.partial(getDamage, options);
		});
		it("doesn't blow up", ()=>
		{
			const callback = ()=> getDamage(options);
			callback.should.not.throw(Error);
		});
		it('gives object results back', ()=>
		{
			_.isObject(getDefaultDamage()).should.be.true;
		});
		it('results in 3 by default', ()=>
		{
			getDefaultDamage().damage.should.equal(3);
		});
	});
});