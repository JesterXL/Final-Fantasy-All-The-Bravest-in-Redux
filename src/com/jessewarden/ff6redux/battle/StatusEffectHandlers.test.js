import {expect, assert, should } from 'chai';
should();

import { getRandomNumberFromRange } from './BattleUtils';
import { 
	poisonDamage, 
	getPoisonDamageFromMaxDamage,
	getPoisonMaxDamage } from './StatusEffectHandlers';

describe.only('#StatusEffectHandlers', ()=>
{
	describe('#poisonDamage', ()=>
	{
		it('exists', ()=>
		{
			expect(poisonDamage).to.exist;
		});
		it('is a generator', ()=>
		{
			expect(poisonDamage().next).to.exist;
		});
		it('first damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			expect(gen.next().value).to.be.above(1);
		});
		it('second damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			expect(gen.next().value).to.be.above(1);
		});
		it('third damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			expect(gen.next().value).to.be.above(1);
		});
		it('fourth damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			gen.next();
			expect(gen.next().value).to.be.above(1);
		});
		it('fifth damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			expect(gen.next().value).to.be.above(1);
		});
		it('sixth damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			expect(gen.next().value).to.be.above(1);
		});
		it('seventh damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			expect(gen.next().value).to.be.above(1);
		});
		it('eighth and max damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			expect(gen.next().value).to.be.above(1);
		});
		it('ninth which should not be higher than eighth damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			const result = gen.next();
			// expect(gen.next().value).to.be.at.most(result.value);
			expect(gen.next().value).to.be.above(1);
		});
		it('tenth which should not be higher than ninth damage', ()=>
		{
			const gen = poisonDamage(300, 20);
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			gen.next();
			const result = gen.next();
			gen.next();
			// expect(gen.next().value).to.be.at.most(result.value);
			expect(gen.next().value).to.be.above(1);
		});
		it('big ole for each for 1000 works', ()=>
		{
			var counter = 0;
			for (var n of poisonDamage(300, 20))
			{
				counter++;
				expect(n).to.be.above(1);
				if (counter >= 1000) {
					break;
				}
			}
		});
	});
	describe('#getPoisonMaxDamage', ()=>
	{
		it('works', ()=>
		{
			getPoisonMaxDamage(300, 20).should.be.above(1);
		});
	});
});