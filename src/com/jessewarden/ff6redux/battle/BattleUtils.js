const log = console.log;
import _ from "lodash";
import TargetHitResult from './TargetHitResult';
import {
	equippedWithGauntlet,
	equippedWithOffering,
	genjiGloveEquipped,
	oneOrZeroWeapons,
	equippedWithAtlasArmlet,
	equippedWith1HeroRing,
	equippedWith2HeroRings,
	equippedWith1Earring,
	equippedWith2Earrings
} from './Character';

const PERFECT_HIT_RATE = 255;

export const divide = (a, b)=>
{
	return Math.floor(a / b);
};

export const getRandomNumberFromRange = (start, end)=>
{
	var range = end - start;
	var result = Math.random() * range;
	result += start;
	return Math.round(result);
};

// level is an int
export const getDamageStep1 = (
	vigor = 1,
	battlePower = 1,
	spellPower = 1,
	magicPower = 1,
	level = 1,
	equippedWithGauntlet = false,
	equippedWithOffering =  false,
	standardFightAttack =  true,
	isPhysicalAttack =  true,
	isMagicalAttack =  false,
	isPlayerAndNotMonster =  true,
	genjiGloveEquipped =  false,
	oneOrZeroWeapons = true
)=>
{

	var damage = 0;

	if(isPhysicalAttack === false && isMagicalAttack === true && isPlayerAndNotMonster === true)
	{
		damage = spellPower * 4 + (level * magicPower * spellPower / 32);
	}
	else if(isPhysicalAttack === false && isMagicalAttack === true && isPlayerAndNotMonster === false)
	{
		damage = spellPower * 4 + (level * (magicPower * 3/2) * spellPower / 32);
	}
	else if(isPhysicalAttack === true && isPlayerAndNotMonster === true)
	{
		var vigor2 = vigor * 2;
		if (vigor >= 128)
		{
			vigor2 = 255;
		}

		var attack = battlePower + vigor2;

		if (equippedWithGauntlet)
		{
			attack += (battlePower * 3 / 4);
		}

		damage = battlePower + ( (level * level * attack) / 256) * 3 / 2;

		if (equippedWithOffering)
		{
			damage /= 2;
		}

		if (standardFightAttack && genjiGloveEquipped && oneOrZeroWeapons)
		{
			damage = Math.ceil(damage * 3/4);
		}
	}
	else if(isPhysicalAttack === true && isPlayerAndNotMonster === false)
	{
		damage = level * level * (battlePower * 4 + vigor) / 256;
	}

	return damage;
};

export const getRandomMonsterVigor = ()=>
{
	return getRandomNumberFromRange(56, 63);
};

export const getDamageStep2 = (
	damage = 0,
	isPhysicalAttack =  true,
	isMagicalAttack =  false,
	equippedWithAtlasArmlet =  false,
	equippedWith1HeroRing =  false,
	equippedWith2HeroRings =  false,
	equippedWith1Earring =  false,
	equippedWith2Earrings = false
)=>
{
	if(isPhysicalAttack && (equippedWithAtlasArmlet || equippedWith1HeroRing))
	{
		damage *= 5/4;
	}
	if(isMagicalAttack && (equippedWith1Earring || equippedWith2HeroRings))
	{
		damage *= 5/4;
	}
	if(isMagicalAttack && (equippedWith2Earrings || equippedWith2HeroRings))
	{
		damage += (damage / 4) + (damage / 4);
	}
	return damage;
};

export const getDamageStep3 = (
	damage = 0,
	isMagicalAttack = false,
	attackingMultipleTargets = false)=>
{
	if(isMagicalAttack === true && attackingMultipleTargets === true)
	{
		return damage / 2;
	}
	else
	{
		return damage;
	}
};

// TODO: figure out 'if fight command'
export const getDamageStep4 = (damage = 0, attackerIsInBackRow = false) =>
{
	if(attackerIsInBackRow === true)
	{
		return damage / 2;
	}
	else
	{
		return damage;
	}
};

export const getCriticalHit = ()=> getRandomNumberFromRange(1, 32) === 32;

export const getDamageStep5 = (damage = 0,
	hasMorphStatus = false,
	hasBerserkStatusAndPhysicalAttack = false,
	isCriticalHit = false) =>
{
	var multiplier = 0;

	if(hasMorphStatus)
	{
		multiplier += 3;
	}

	if(hasBerserkStatusAndPhysicalAttack)
	{
		multiplier += 2;
	}

	if(isCriticalHit)
	{
		multiplier += 3;
	}

	damage += ((damage / 2) * multiplier);
	return damage;
}

export const getDamageModificationsVariance = ()=> getRandomNumberFromRange(224, 255);

export const getDamageStep6 = (damage = 0,
	defense = 0,
	magicalDefense = 0,
	variance =  224,
	isPhysicalAttack =  true,
	isMagicalAttack =  false,
	isHealingAttack =  false,
	targetHasSafeStatus =  false,
	targetHasShellStatus =  false,
	targetDefending =  false,
	targetIsInBackRow =  false,
	targetHasMorphStatus =  false,
	targetIsSelf =  false,
	targetIsCharacter =  false,
	attackerIsCharacter =  true) =>
{

	damage = (damage * variance / 256) + 1;

	// defense modification
	if(isPhysicalAttack)
	{
		damage = (damage * (255 - defense) / 256) + 1;
	}
	else
	{
		damage = (damage * (255 - magicalDefense) / 256) + 1;
	}

	// safe / shell
	if((isPhysicalAttack && targetHasSafeStatus) || (isMagicalAttack && targetHasShellStatus))
	{
		damage = (damage * 170 / 256) + 1;
	}

	// target defending
	if(isPhysicalAttack && targetDefending)
	{
		damage /= 2;
	}

	// target's back row
	if(isPhysicalAttack && targetIsInBackRow)
	{
		damage /= 2;
	}

	// morph
	if(isMagicalAttack && targetHasMorphStatus)
	{
		damage /= 2;
	}

	// self damage (healing attack skips this step)
	if(isHealingAttack === false)
	{
		if (targetIsSelf && targetIsCharacter && attackerIsCharacter)
		{
			damage /= 2;
		}
	}

	return damage;
};

export const getDamageStep7 = (damage = 0,
						hittingTargetsBack = false,
						isPhysicalAttack = true) =>
{
	var multiplier = 0;
	if(isPhysicalAttack && hittingTargetsBack)
	{
		multiplier += 1;
	}

	damage += ((damage / 2) * multiplier);
	return damage;
};

export const getDamageStep8 = (damage = 0, targetHasPetrifyStatus = false)=>
{
	if(targetHasPetrifyStatus)
	{
		damage = 0;
	}
	return damage;
};

export const getDamageStep9 = (
	damage = 0,
	elementHasBeenNullified =  false,
	targetAbsorbsElement =  false,
	targetIsImmuneToElement =  false,
	targetIsResistantToElement =  false,
	targetIsWeakToElement = false
) =>
{
	if(elementHasBeenNullified)
	{
		return 0;
	}

	if(targetAbsorbsElement)
	{
		return -damage;
	}

	if(targetIsImmuneToElement)
	{
		return 0;
	}

	if(targetIsResistantToElement)
	{
		damage /= 2;
		return damage;
	}

	if(targetIsWeakToElement)
	{
		damage *= 2;
		return damage;
	}

	return damage;
};

function getRandomHitOrMissValue()
{
	return getRandomNumberFromRange(0, 99);
}

function getRandomStaminaHitOrMissValue()
{
	return getRandomNumberFromRange(0, 127);
}

function getRandomImageStatusRemoval()
{
	return getRandomNumberFromRange(0, 3);
}

function getRemoveImageStatus()
{
	return getRandomNumberFromRange(1, 4) === 4;
}

export const getHitResult = (hit, removeImageStatus=false) =>
{
	return {
		hit,
		removeImageStatus
	};
};

// returns HitResult
/*
	These are ints, not numbers:

	int randomHitOrMissValue =  0,
	int randomStaminaHitOrMissValue =  0,
	int randomImageStatusRemovalValue =  0,
	int hitRate =  180,  // TODO: need weapon's info, this is where hitRate comes from
	int magicBlock =  0,
	int targetStamina =  null,
	specialAttackType:AttackType
*/
export const getHit = (
	randomHitOrMissValue =  0,
	randomStaminaHitOrMissValue =  0,
	isPhysicalAttack =  true,
	isMagicalAttack =  false,
	targetHasClearStatus =  false,
	protectedFromWound =  false,
	attackMissesDeathProtectedTargets =  false,
	attackCanBeBlockedByStamina =  true,
	spellUnblockable =  false,
	targetHasSleepStatus =  false,
	targetHasPetrifyStatus =  false,
	targetHasFreezeStatus =  false,
	targetHasStopStatus =  false,
	backOfTarget =  false,
	targetHasImageStatus =  false,
	hitRate =  180,  // TODO: need weapon's info, this is where hitRate comes from
	magicBlock =  0,
	targetStamina =  null,
	specialAttackType = null) =>
{
	if(isPhysicalAttack && targetHasClearStatus)
	{
		return getHitResult(false);
	}

	if(isMagicalAttack && targetHasClearStatus)
	{
		return getHitResult(true);
	}

	if(protectedFromWound && attackMissesDeathProtectedTargets)
	{
		return getHitResult(false);
	}

	if(isMagicalAttack && spellUnblockable)
	{
		return getHitResult(true);
	}

	if(_.isNil(specialAttackType))
	{
		if(targetHasSleepStatus || targetHasPetrifyStatus || targetHasFreezeStatus || targetHasStopStatus)
		{
			return getHitResult(true);
		}

		if(isPhysicalAttack && backOfTarget)
		{
			return getHitResult(true);
		}

		if(hitRate === PERFECT_HIT_RATE)
		{
			return getHitResult(true);
		}

		if(isPhysicalAttack && targetHasImageStatus)
		{
			var removeImageStatus = getRemoveImageStatus();
			if(removeImageStatus)
			{
				// this'll remove Image status
				return getHitResult(false, true);
			}
			else
			{
				return getHitResult(false);
			}
		}

		var blockValue = (255 - (magicBlock * 2));
		blockValue = Math.floor(blockValue);
		blockValue++;
		blockValue = _.clamp(blockValue, 1, 255);
//			num blockValue = ((255 - magicBlock * 2).floor() + 1).clamp(1, 255);

		if((hitRate * blockValue / 256) > randomHitOrMissValue)
		{
			return getHitResult(true);
		}
		else
		{
			return getHitResult(false);
		}
	}

	var blockValue = ((255 - magicBlock * 2) + 1).floor();
	blockValue = _.clamp(blockValue, 1, 255);

	if( ((hitRate * blockValue) / 256) > randomHitOrMissValue)
	{
		if(targetStamina >= randomStaminaHitOrMissValue)
		{
			return getHitResult(false);
		}
		else
		{
			return getHitResult(true);
		}
	}
	else
	{
		return getHitResult(false);
	}
};

const isStandardFightAttack = (isPhysicalAttack, isMagicalAttack) => isPhysicalAttack && isMagicalAttack === false;

// returns TargetHitResult 
/*
	int hitRate =  180,  // TODO: need weapon's info, this is where hitRate comes from
	int magicBlock =  0,
	int targetStamina =  null,
*/
export const getHitAndApplyDamage = (
	attacker, // Character
	targetStamina =  null,
	isPhysicalAttack =  true,
	isMagicalAttack =  false,
	targetHasClearStatus =  false,
	protectedFromWound =  false,
	attackMissesDeathProtectedTargets =  false,
	attackCanBeBlockedByStamina =  true,
	spellUnblockable =  false,
	targetHasSleepStatus =  false,
	targetHasPetrifyStatus =  false,
	targetHasFreezeStatus =  false,
	targetHasStopStatus =  false,
	targetHasSafeStatus =  false,
	targetHasShellStatus =  false,
	targetDefending =  false,
	targetIsInBackRow =  false,
	targetHasMorphStatus =  false,
	targetIsSelf =  false,
	targetIsCharacter =  false,
	backOfTarget =  false,
	targetHasImageStatus =  false,
	hitRate =  180,  // TODO: need weapon's info, this is where hitRate comes from
	magicBlock =  0,
	specialAttackType =  null,
	attackerIsCharacter =  true,
	attackingMultipleTargets =  false,
	attackerIsInBackRow =  false,
	attackerHasMorphStatus =  false,
	attackerHasBerserkStatusAndPhysicalAttack =  false,
	elementHasBeenNullified =  false,
	targetAbsorbsElement =  false,
	targetIsImmuneToElement =  false,
	targetIsResistantToElement =  false,
	targetIsWeakToElement = false) =>
{
	var hitResult = getHit(
		getRandomHitOrMissValue(),
		getRandomStaminaHitOrMissValue(),
		getRandomImageStatusRemoval(),
		isPhysicalAttack,
		isMagicalAttack,
		targetHasClearStatus,
		protectedFromWound,
		attackMissesDeathProtectedTargets,
		attackCanBeBlockedByStamina,
		spellUnblockable,
		targetHasSleepStatus,
		targetHasPetrifyStatus,
		targetHasFreezeStatus,
		targetHasStopStatus,
		backOfTarget,
		targetHasImageStatus,
		hitRate,
		magicBlock,
		targetStamina,
		specialAttackType
	);
	var damage = 0;
	var criticalHit = getCriticalHit();
	var damageModificationVariance = getDamageModificationsVariance();
	var standardFightAttack = isStandardFightAttack(isPhysicalAttack, isMagicalAttack);
	if(hitResult.hit === true)
	{
		damage = getDamageStep1(
			attacker.vigor,
			attacker.battlePower,
			attacker.level,
			equippedWithGauntlet(attacker),
			equippedWithOffering(attacker),
			standardFightAttack,
			genjiGloveEquipped(attacker),
			oneOrZeroWeapons(attacker)
		);

		damage = getDamageStep2(
			damage,
			isPhysicalAttack,
			isMagicalAttack,
			equippedWithAtlasArmlet(attacker),
			equippedWith1HeroRing(attacker),
			equippedWith2HeroRings(attacker),
			equippedWith1Earring(attacker),
			equippedWith2Earrings(attacker)
		);

		damage = getDamageStep3(
			damage,
			isMagicalAttack,
			attackingMultipleTargets);

		damage = getDamageStep4(
			damage,
			attackerIsInBackRow
		);

		damage = getDamageStep5(
			damage,
			attackerHasMorphStatus,
			attackerHasBerserkStatusAndPhysicalAttack,
			criticalHit
		);

		damage = getDamageStep6(
			damage,
			attacker.defense,
			attacker.magicDefense,
			damageModificationVariance,
			isPhysicalAttack,
			isMagicalAttack,
			targetHasSafeStatus,
			targetHasShellStatus,
			targetDefending,
			targetIsInBackRow,
			targetHasMorphStatus,
			targetIsSelf,
			targetIsCharacter,
			attackerIsCharacter
		);

		damage = getDamageStep7(
			damage,
			backOfTarget,
			isPhysicalAttack
		);

		damage = getDamageStep8(
			damage,
			targetHasPetrifyStatus
		);

		damage = getDamageStep9(
			damage,
			elementHasBeenNullified,
			targetAbsorbsElement,
			targetIsImmuneToElement,
			targetIsResistantToElement,
			targetIsWeakToElement
		);
	}

	damage = Math.round(damage);
	damage = _.clamp(damage, -9999, 9999);

	// TODO: support attacking mulitple targets
	// console.log("hitResult:", hitResult);
	return new TargetHitResult(
		hitResult.hit,
		undefined,
		damage,
		criticalHit,
		hitResult.removeImageStatus
	);

//		targetHitResults.add(
//			new TargetHitResult(
//				criticalHit: criticalHit,
//				hit: hitResult.hit,
//				damage: damage,
//				removeImageStatus: hitResult.removeImageStatus,
//				target: target
//			)
//		);
}
