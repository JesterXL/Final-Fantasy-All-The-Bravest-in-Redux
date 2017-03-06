import Row from "../enums/Row";
import _ from "lodash";
import {Subject} from "rx";
import {BattleTimer, MODE_PLAYER, EFFECT_NORMAL} from './battleTimer';
import BattleState from '../enums/BattleState';
import {
	isGauntlet,
	isAtlasArmlet,
	isEarring,
	isGenjiGlove,
	isHeroRing,
	isOffering
} from '../relics';

export const none = _.negate(_.every);
export const notNil = _.negate(_.isNil);

let _INCREMENT = 0;

export const getCharacter = (entity)=>
{
	var vm = {};
	vm.entity = entity;
	vm.percentage = 0;
	vm.name = '';
	vm.battleState = BattleState.WAITING;
	vm.hitPoints = 10;
	vm.vigor = 10;
	vm.speed = 80;
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
};

export function makePlayer(entity)
{
	var chr = getCharacter(entity);
	chr.characterType = 'player';
	chr.battlePower = 50;
	chr.entity = entity;
	return chr;
}

export function makeMonster(entity)
{
	var chr = getCharacter(entity);
	chr.characterType = 'monster';
	chr.entity = entity;
	return chr;
}

export function makeReadyCharacter(entity)
{
	var chr = getCharacter(entity);
	chr.battleState = BattleState.READY;
	return chr;
}

export function getRandomMonsterVigor()
{
	return BattleUtils.getRandomMonsterVigor();
}

export function makeBattleTimer(chr)
{
	return new BattleTimer(0, 0, EFFECT_NORMAL, MODE_PLAYER, chr.speed);
}

// TODO: figure out reflection/mirrors
export function equippedWithNoRelics(chr)
{
	return _.isNil(_.get(chr, 'relic1')) && _.isNil(_.get(chr, 'relic2'));
}

export const characterRelics           = (chr) => [_.get(chr, 'relic1'), _.get(chr, 'relic2')];
export const equippedWith              = (chr, isRelicType) => _.some(characterRelics(chr), isRelicType);
export const equippedWithGauntlet      = _.partialRight(equippedWith, isGauntlet);
export const equippedWithOffering      = _.partialRight(equippedWith, isOffering);
export const equippedWithGenjiGlove    = _.partialRight(equippedWith, isGenjiGlove);
export const equippedWithAtlasArmlet   = _.partialRight(equippedWith, isAtlasArmlet);
export const equippedWithHeroRing      = _.partialRight(equippedWith, isHeroRing);
export const equippedWith2HeroRings    = (chr) => _.every(characterRelics(chr), isHeroRing);
export const notEquippedWith2HeroRings = _.negate(equippedWith2HeroRings);
export const equippedWith1HeroRing     = (chr) => _.every([equippedWithHeroRing, notEquippedWith2HeroRings], f => f(chr));
export const equippedWithEarring       = _.partialRight(equippedWith, isEarring);
export const equippedWith2Earrings     = (chr) => _.every(characterRelics(chr), isEarring);
export const notEquippedWith2Earrings  = _.negate(equippedWith2Earrings);
export const equippedWith1Earring      = (chr) => _.every([equippedWithEarring, notEquippedWith2Earrings], f => f(chr));

export const rightHandHasWeapon        = (chr) => notNil(_.get(chr, 'rightHand'));
export const leftHandHasWeapon         = (chr) => notNil(_.get(chr, 'leftHand'));
export const rightHandHasNoWeapon      = _.negate(rightHandHasWeapon);
export const leftHandHasNoWeapon       = _.negate(leftHandHasWeapon);
export const hasZeroWeapons            = (chr) => _.every([rightHandHasNoWeapon, leftHandHasNoWeapon], f => f(chr));
export const has2Weapons               = (chr) => _.every([rightHandHasWeapon, leftHandHasWeapon], f => f(chr));
export const doesNotHave2Weapons       = _.negate(has2Weapons);

export const oneOrZeroWeapons = (chr) =>
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
};

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