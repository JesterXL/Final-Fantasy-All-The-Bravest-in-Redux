const log = console.log;
const _ = require("lodash");
import { union } from 'folktale/adt/union/union';
import Equality from 'folktale/adt/union/derivations/equality';

const {
	equippedWithGauntlet,
	equippedWithOffering,
	equippedWithGenjiGlove,
	oneOrZeroWeapons,
	equippedWithAtlasArmlet,
	equippedWith1HeroRing,
	equippedWith2HeroRings,
	equippedWith1Earring,
	equippedWith2Earrings
} = require('./Character');

const PERFECT_HIT_RATE = 255;

export const divide = (a, b) => Math.floor(a / b);

export const getRandomNumberFromRange = (start, end)=>
{
	let range = end - start;
	let result = Math.random() * range;
	result += start;
	return Math.round(result);
};

// level is an int
export const getDamageStep1 = (
	vigor = 0,
	battlePower = 0,
	spellPower = 0,
	magicPower = 0,
	level = 0,
	equippedWithGauntlet = false,
	equippedWithOffering =  false,
	standardFightAttack =  true,
	isPhysicalAttack =  true,
	isPlayerAndNotMonster =  true,
	genjiGloveEquipped =  false,
	oneOrZeroWeapons = true
)=>
{

	let damage = 0;

	if(isPhysicalAttack === false && isPlayerAndNotMonster === true)
	{
		damage = spellPower * 4 + (level * magicPower * spellPower / 32);
	}
	else if(isPhysicalAttack === false && isPlayerAndNotMonster === false)
	{
		damage = spellPower * 4 + (level * (magicPower * 3/2) * spellPower / 32);
	}
	else if(isPhysicalAttack === true && isPlayerAndNotMonster === true)
	{
		let vigor2 = vigor * 2;
		if (vigor >= 128)
		{
			vigor2 = 255;
		}

		let attack = battlePower + vigor2;

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

export const getRandomMonsterVigor = ()=> getRandomNumberFromRange(56, 63);

export const getDamageStep2 = (
	damage = 0,
	isPhysicalAttack =  true,
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
	if(isPhysicalAttack === false && (equippedWith1Earring || equippedWith2HeroRings))
	{
		damage *= 5/4;
	}
	if(isPhysicalAttack === false && (equippedWith2Earrings || equippedWith2HeroRings))
	{
		damage += (damage / 4) + (damage / 4);
	}
	return damage;
};

export const getDamageStep3 = (
	damage = 0,
	isPhysicalAttack = true,
	attackingMultipleTargets = false)=>
{
	if(isPhysicalAttack === false && attackingMultipleTargets === true)
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
	if((isPhysicalAttack && targetHasSafeStatus) || (isPhysicalAttack === false && targetHasShellStatus))
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
	if(isPhysicalAttack === false && targetHasMorphStatus)
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
	let multiplier = 0;
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

export const getRandomHitOrMissValue = ()=> getRandomNumberFromRange(0, 99);

export const getRandomStaminaHitOrMissValue = ()=> getRandomNumberFromRange(0, 127);

export const getRandomImageStatusRemoval = ()=> getRandomNumberFromRange(0, 3);

export const getRemoveImageStatus = ()=> getRandomNumberFromRange(1, 4) === 4;

export const getMonsterStamina = maxHitPoints =>
{
	// (Max HP / 512) + 16
	const result = (maxHitPoints / 512) + 16;
	return _.clamp(result, 0, 40);
};

export const getHitResult = (hit, removeImageStatus=false) =>
({
	hit,
	removeImageStatus
});

// Step 4e. Chance to hit

//   1. BlockValue = (255 - MBlock * 2) + 1

//   2. If BlockValue > 255 then BlockValue = 255
//      If BlockValue < 1 then BlockValue = 1

//   3. If ((Hit Rate * BlockValue) / 256) > [0..99] then you hit; otherwise,
//      you miss.
export const step4e = magicBlock =>
{
	let blockValue = (255 - magicBlock * 2) + 1;
	blockValue = _.clamp(blockValue, 1, 255);
	return blockValue;
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
export const getHitFromBlockValue = (isPhysicalAttack=true, hitRate, magicBlockOrDefense, step4e, randomHitOrMissValue)=>
{
	let blockValue;
	// NOTE: [jwarden 1.23.2017] After re-reading this bug for umpteenth time,
	// I'm thinking of attempting a fix, and allowing this to be toggled on
	// at a later date. (tl;dr; Originally, magicBlock was used causing all kinds
	// of havoc).
	// http://everything2.com/title/Final+Fantasy+VI+Evade+Bug
	// NOTE: here in case we handle that whole 'magic block' bug; for now both if thens do the same
	if(isPhysicalAttack === false)
	{
		log("magicBlock:", magicBlockOrDefense);
		log("hitRate:", hitRate);
		blockValue =  step4e(magicBlockOrDefense);
	}
	else
	{
		log("defenese:", magicBlockOrDefense);
		log("hitRate:", hitRate);
		blockValue =  step4e(magicBlockOrDefense);
	}

	//   3. If ((Hit Rate * BlockValue) / 256) > [0..99] then you hit; otherwise,
	//      you miss.
	const hitRateTimesBlockValue = hitRate * blockValue;
	const result = hitRateTimesBlockValue / 256;
	// log("getHit results:");
	// log("hitRate:", hitRate);
	// log("blockValue:", blockValue);
	// log("hitRateTimesBlockValue:", hitRateTimesBlockValue);
	// log("result:", result);
	// log("randomHitOrMissValue:", randomHitOrMissValue);
	if( result > randomHitOrMissValue)
	{
		return true;
	}
	else
	{
		return false;
	}
};

const getMagicBlockOrDefense = (isPhysicalAttack=true, magicBlock, defense)=>
{
	if(isPhysicalAttack === true)
	{
		return defense;
	}
	else
	{
		return magicBlock;
	}
};

export const getHitDefaultGetHitOptions = ()=> ({
	randomHitOrMissValue: 0,
	randomStaminaHitOrMissValue: 0,
	isPhysicalAttack: true,
	targetHasClearStatus: false,
	protectedFromWound: false,
	attackMissesDeathProtectedTargets: false,
	attackCanBeBlockedByStamina: true,
	spellUnblockable: false,
	targetHasSleepStatus: false,
	targetHasPetrifyStatus: false,
	targetHasFreezeStatus: false,
	targetHasStopStatus: false,
	backOfTarget: false,
	targetHasImageStatus: false,
	hitRate: 0,  // TODO: need weapon's info, this is where hitRate comes from
	defense: 0,
	magicBlock: 0,
	targetStamina: 0,
	specialAttackType: null
});
	
export const getHit = (options=getHitDefaultGetHitOptions()) =>
{
	const randomHitOrMissValue              = _.get(options, 'randomHitOrMissValue');
	const randomStaminaHitOrMissValue       = _.get(options, 'randomStaminaHitOrMissValue');
	const isPhysicalAttack                  = _.get(options, 'isPhysicalAttack');
	const isMagicalAttack					= !isPhysicalAttack;
	const targetHasClearStatus              = _.get(options, 'targetHasClearStatus');
	const protectedFromWound                = _.get(options, 'protectedFromWound');
	const attackMissesDeathProtectedTargets = _.get(options, 'attackMissesDeathProtectedTargets');
	const attackCanBeBlockedByStamina       = _.get(options, 'attackCanBeBlockedByStamina');
	const spellUnblockable                  = _.get(options, 'spellUnblockable');
	const targetHasSleepStatus              = _.get(options, 'targetHasSleepStatus');
	const targetHasPetrifyStatus            = _.get(options, 'targetHasPetrifyStatus');
	const targetHasFreezeStatus             = _.get(options, 'targetHasFreezeStatus');
	const targetHasStopStatus               = _.get(options, 'targetHasStopStatus');
	const backOfTarget                      = _.get(options, 'backOfTarget');
	const targetHasImageStatus              = _.get(options, 'targetHasImageStatus');
	const hitRate                           = _.get(options, 'hitRate');
	const defense                           = _.get(options, 'defense');
	const magicBlock                        = _.get(options, 'magicBlock');
	const targetStamina                     = _.get(options, 'targetStamina');
	const specialAttackType                 = _.get(options, 'specialAttackType');

	if(isPhysicalAttack && targetHasClearStatus)
	{
		return getHitResult(false);
	}

	if(isPhysicalAttack === false && targetHasClearStatus)
	{
		return getHitResult(true);
	}

	if(protectedFromWound && attackMissesDeathProtectedTargets)
	{
		return getHitResult(false);
	}

	if(isPhysicalAttack === false && spellUnblockable)
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
			let removeImageStatus = getRemoveImageStatus();
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


		// Step 4e. Chance to hit

		//   1. BlockValue = (255 - MBlock * 2) + 1
	
		//   2. If BlockValue > 255 then BlockValue = 255
		//      If BlockValue < 1 then BlockValue = 1

		//   3. If ((Hit Rate * BlockValue) / 256) > [0..99] then you hit; otherwise,
		//      you miss.
		const magicBlockOrDefense = getMagicBlockOrDefense(isPhysicalAttack, magicBlock, defense);
		const hitFromBlockValue = getHitFromBlockValue(isPhysicalAttack, hitRate, magicBlockOrDefense, step4e, randomHitOrMissValue);
		return getHitResult(hitFromBlockValue);
	}

	// Most attacks use step 4 instead of this step. Only Break, Doom, Demi,
    // Quartr, X-Zone, W Wind, Shoat, Odin, Raiden, Antlion, Snare, X-Fer, and
    // Grav Bomb use this step.

    // Step 5b. Check if Stamina blocks

    //   If target's stamina >= [0..127] then the attack misses (even if it hit in
    //   step 5a); otherwise, the attack hits as long as it hit in step 5a.

	const magicBlockOrDefense = getMagicBlockOrDefense(isPhysicalAttack, magicBlock, defense);
	const hitFromBlockValue = getHitFromBlockValue(isPhysicalAttack, hitRate, magicBlockOrDefense, step4e, randomHitOrMissValue);
	log("      ");
	log("\n");
	log("hitFromBlockValue:", hitFromBlockValue);
	log("randomHitOrMissValue:", randomHitOrMissValue);
	log("randomStaminaHitOrMissValue:", randomStaminaHitOrMissValue);
	log("targetStamina:", targetStamina);
	if(hitFromBlockValue === true)
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

export const getDamageResult = (damage, criticalHit, removeImageStatus)=>
{
	return {
		damage,
		criticalHit,
		removeImageStatus
	};
};

// returns TargetHitResult 
/*
	int hitRate =  180,  // TODO: need weapon's info, this is where hitRate comes from
	int magicBlock =  0,
	int targetStamina =  null,
*/
export const getDefaultDamageOptions = (
	attacker, 
	getCriticalHitFunction=getCriticalHit, 
	getDamageModificationsVarianceFunction=getDamageModificationsVariance
)=>
({
	attacker, // Character
	getCriticalHitFunction,
	getDamageModificationsVarianceFunction,
	targetStamina: null,
	isPhysicalAttack: true,
	targetHasClearStatus: false,
	protectedFromWound: false,
	attackMissesDeathProtectedTargets: false,
	attackCanBeBlockedByStamina: true,
	spellUnblockable: false,
	targetHasSleepStatus: false,
	targetHasPetrifyStatus: false,
	targetHasFreezeStatus: false,
	targetHasStopStatus: false,
	targetHasSafeStatus: false,
	targetHasShellStatus: false,
	targetDefending: false,
	targetIsInBackRow: false,
	targetHasMorphStatus: false,
	targetIsSelf: false,
	targetIsCharacter: false,
	backOfTarget: false,
	targetHasImageStatus: false,
	hitRate: 0,  // TODO: need weapon's info, this is where hitRate comes from
	magicBlock: 0,
	specialAttackType: null,
	attackerIsCharacter: true,
	attackingMultipleTargets: false,
	attackerIsInBackRow: false,
	attackerHasMorphStatus: false,
	attackerHasBerserkStatusAndPhysicalAttack: false,
	elementHasBeenNullified: false,
	targetAbsorbsElement: false,
	targetIsImmuneToElement: false,
	targetIsResistantToElement: false,
	targetIsWeakToElement: false
});

export const getDamage = (options=getDefaultDamageOptions()) =>
{
	const attacker                                  = _.get(options, 'attacker');
	const targetStamina                             = _.get(options, 'targetStamina');
	const isPhysicalAttack                          = _.get(options, 'isPhysicalAttack');
	const targetHasClearStatus                      = _.get(options, 'targetHasClearStatus');
	const protectedFromWound                        = _.get(options, 'protectedFromWound');
	const attackMissesDeathProtectedTargets         = _.get(options, 'attackMissesDeathProtectedTargets');
	const attackCanBeBlockedByStamina               = _.get(options, 'attackCanBeBlockedByStamina');
	const spellUnblockable                          = _.get(options, 'spellUnblockable');
	const targetHasSleepStatus                      = _.get(options, 'targetHasSleepStatus');
	const targetHasPetrifyStatus                    = _.get(options, 'targetHasPetrifyStatus');
	const targetHasFreezeStatus                     = _.get(options, 'targetHasFreezeStatus');
	const targetHasStopStatus                       = _.get(options, 'targetHasStopStatus');
	const targetHasSafeStatus                       = _.get(options, 'targetHasSafeStatus');
	const targetHasShellStatus                      = _.get(options, 'targetHasShellStatus');
	const targetDefending                           = _.get(options, 'targetDefending');
	const targetIsInBackRow                         = _.get(options, 'targetIsInBackRow');
	const targetHasMorphStatus                      = _.get(options, 'targetHasMorphStatus');
	const targetIsSelf                              = _.get(options, 'targetIsSelf');
	const targetIsCharacter                         = _.get(options, 'targetIsCharacter');
	const backOfTarget                              = _.get(options, 'backOfTarget');
	const targetHasImageStatus                      = _.get(options, 'targetHasImageStatus');
	const hitRate                                   = _.get(options, 'hitRate');
	const magicBlock                                = _.get(options, 'magicBlock');
	const specialAttackType                         = _.get(options, 'specialAttackType');
	const attackerIsCharacter                       = _.get(options, 'attackerIsCharacter');
	const attackingMultipleTargets                  = _.get(options, 'attackingMultipleTargets');
	const attackerIsInBackRow                       = _.get(options, 'attackerIsInBackRow');
	const attackerHasMorphStatus                    = _.get(options, 'attackerHasMorphStatus');
	const attackerHasBerserkStatusAndPhysicalAttack = _.get(options, 'attackerHasBerserkStatusAndPhysicalAttack');
	const elementHasBeenNullified                   = _.get(options, 'elementHasBeenNullified');
	const targetAbsorbsElement                      = _.get(options, 'targetAbsorbsElement');
	const targetIsImmuneToElement                   = _.get(options, 'targetIsImmuneToElement');
	const targetIsResistantToElement                = _.get(options, 'targetIsResistantToElement');
	const targetIsWeakToElement                     = _.get(options, 'targetIsWeakToElement');
	const getCriticalHitFunction					= _.get(options, 'getCriticalHitFunction');
	const getDamageModificationsVarianceFunction	= _.get(options, 'getDamageModificationsVarianceFunction');


	let damage = 0;
	let criticalHit = getCriticalHitFunction();
	let damageModificationVariance = getDamageModificationsVarianceFunction();
	
	damage = getDamageStep1(
		attacker.vigor,
		attacker.battlePower,
		attacker.level,
		equippedWithGauntlet(attacker),
		equippedWithOffering(attacker),
		isPhysicalAttack,
		equippedWithGenjiGlove(attacker),
		oneOrZeroWeapons(attacker)
	);

	damage = getDamageStep2(
		damage,
		isPhysicalAttack,
		equippedWithAtlasArmlet(attacker),
		equippedWith1HeroRing(attacker),
		equippedWith2HeroRings(attacker),
		equippedWith1Earring(attacker),
		equippedWith2Earrings(attacker)
	);

	damage = getDamageStep3(
		damage,
		isPhysicalAttack,
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

	damage = Math.round(damage);
	damage = _.clamp(damage, -9999, 9999);

	// TODO: support attacking mulitple targets
	return getDamageResult(damage, criticalHit);

// should probably return an array of these...
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
