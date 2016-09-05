import Row from "../enums/Row";
import _ from "lodash";
import {Subject} from "rx";
import {battleTimer} from './BattleTimer';
import BattleState from '../enums/BattleState';
import Relic from '../items/Relic';
import AtlasArmlet from '../items/AtlasArmlet';
import Earring from '../items/Earring';
import Gauntlet from '../items/Gauntlet';
import GenjiGlove from '../items/GenjiGlove';
import HeroRing from '../items/HeroRing';
import Offering from '../items/Offering';

var _INCREMENT = 0;

var notNil = _.negate(_.isNil);

export function Character(entity)
{
	var vm = {};
	vm.entity = entity;
	vm.percentage = 0;
	vm.name = '';
	vm.battleState = BattleState.WAITING;
	vm.hitPoints = 10;
	vm.vigor = 10;
	vm.speed = 10;
	vm.stamina = 10;
	vm.magicPower = 10;
	vm.evade = 1;
	vm.magicBlock = 10;
	vm.defense = 10;
	vm.magicDefense = 10;
	vm.battlePower = 1;
	vm.hitRate = 100;
	vm.dead = false;
	vm.level = 3;
	vm.rightHand;
	vm.leftHand;
	vm.head;
	vm.body;
	vm.relic1;
	vm.relic2;
	vm._row = Row.FRONT;
	vm.id = _INCREMENT++;
	vm.subject = new Subject();
	vm.generator = makeBattleTimer(vm);
	vm.type = 'Character';
	vm.characterType = 'player';
	return vm;
}

export function makePlayer(entity)
{
	var chr = new Character();
	chr.characterType = 'player';
	chr.battlePower = 50;
	chr.entity = entity;
	return chr;
}

export function makeMonster(entity)
{
	var chr = new Character();
	chr.characterType = 'monster';
	chr.entity = entity;
	return chr;
}

export function getRandomMonsterVigor()
{
	return BattleUtils.getRandomMonsterVigor();
}

export function makeBattleTimer(chr)
{
	return battleTimer(0, 0, chr.speed);
}

// TODO: figure out reflection/mirrors
export function equippedWithNoRelics(chr)
{
	return _.isNil(chr.relic1) && _.isNil(chr.relic2);
}

export function equippedWithGauntlet(chr)
{
	return chr.relic1 instanceof Gauntlet || chr.relic2 instanceof Gauntlet;
}

export function equippedWithOffering(chr)
{
	return chr.relic1 instanceof Offering || chr.relic2 instanceof Offering;
}

export function genjiGloveEquipped(chr)
{
	return chr.relic1 instanceof GenjiGlove || chr.relic2 instanceof GenjiGlove;
}

export function equippedWithAtlasArmlet(chr)
{
	return chr.relic1 instanceof AtlasArmlet || chr.relic2 instanceof AtlasArmlet;
}

export function equippedWithHeroRing(chr)
{
	return chr.relic1 instanceof HeroRing || chr.relic2 instanceof HeroRing;
}

export function equippedWith1HeroRing(chr)
{
	return (chr.relic1 instanceof HeroRing 
			&& !chr.relic2 instanceof HeroRing) || 
			(!chr.relic1 instanceof HeroRing 
				&& chr.relic2 instanceof HeroRing);
}

export function equippedWith2HeroRings(chr)
{
	return chr.relic1 instanceof HeroRing && 
			chr.relic2 instanceof HeroRing;
}

export function equippedWithEarring(chr)
{
	return chr.relic1 instanceof Earring || 
			chr.relic2 instanceof Earring;
}

export function equippedWith1Earring(chr)
{
	return (chr.relic1 instanceof Earring 
			&& !chr.relic2 instanceof Earring) 
			|| (!chr.relic1 instanceof Earring && 
					chr.relic2 instanceof Earring);
}

export function equippedWith2Earrings(chr)
{
	return chr.relic1 instanceof Earring && chr.relic2 instanceof Earring;
}

export function rightHandHasWeapon(chr){ notNil(chr.rightHand)};
export function leftHandHasWeapon(chr){ notNil(chr.leftHand)};
export function rightHandHasNoWeapon(chr){ !rightHandHasWeapon(chr)};
export function leftHandHasNoWeapon(chr){ !rightHandHasWeapon(chr)};
export function hasZeroWeapons(chr){ rightHandHasNoWeapon(chr) && leftHandHasNoWeapon(chr)};

export function oneOrZeroWeapons(chr)
{
	if(rightHandHasWeapon(chr) && leftHandHasNoWeapon(chr))
	{
		return true;
	}
	else if(rightHandHasNoWeapon(chr) && leftHandHasWeapon(chr))
	{
		return true;
	}
	else if(hasZeroWeapons(chr))
	{
		return true;
	}
	else
	{
		return false;
	}
}

// export function getHitPoints(chr)
// {
// 	return chr._hitPoints;
// }

// export function setHitPoints(chr, newValue)
// {
// 	var oldValue = chr._hitPoints;
// 	if(chr._hitPoints != newValue)
// 	{
// 		chr._hitPoints = newValue;
// 		chr.subject.onNext({
// 			type: "hitPointsChanged", 
// 			target: chr, 
// 			changeAmount: newValue - oldValue
// 		});
// 		if(oldValue <= 0 && newValue >= 1)
// 		{
// 			chr.dead = false;
// 			subject.onNext({type: "noLongerSwoon", target: chr});
// 		}
// 		else if(oldValue >= 1 && newValue <= 0)
// 		{
// 			chr.dead = true;
// 			subject.onNext({type: "swoon", target: chr});
// 		}
// 	}
// }

export function getRow(chr)
{
	return chr._row;
}
export function setRow(chr, newRow)
{
	if(newRow === chr._row)
	{
		return;
	}
	var oldRow = chr._row;
	chr._row = newRow;
	chr.subject.onNext({
		type: "rowChanged",
		target: chr,
		oldRow: oldRow,
		newRow: newRow
	});
}

export function toggleRow(chr)
{
	if(chr.row === Row.FRONT)
	{
		chr.row = Row.BACK;
	}
	else
	{
		chr.row = Row.FRONT;
	}
}