const log = console.log;
const Row = require("../enums/Row");
const _ = require("lodash");
const {Subject} = require("rx");
const {BattleTimer, MODE_PLAYER, EFFECT_NORMAL} = require('./battleTimer');
import BattleState from '../enums/BattleState';
const {
	isGauntlet,
	isAtlasArmlet,
	isEarring,
	isGenjiGlove,
	isHeroRing,
	isOffering
} = require('../relics');

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
	vm.defending = false;
	vm.hitPoints = 10;
	vm.maxHitPoints = 10;
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
	// vm.subject = new Subject();
	// vm.generator = makeBattleTimer(vm);
	vm.type = 'Character';
	vm.characterType = 'player';
	return vm;
};

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