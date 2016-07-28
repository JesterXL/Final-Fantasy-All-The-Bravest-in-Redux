import Row from "../enums/Row";
import _ from "lodash";
import {Subject} from "rx";
import BattleTimer from './BattleTimer2';
import BattleState from '../enums/BattleState';

var _INCREMENT = 0;
class Character
{
	// TODO: figure out reflection/mirrors
	equippedWithNoRelics()
	{
		return _.isNil(this.relic1) && _.isNil(this.relic2);
	}

	equippedWithGauntlet()
	{
		return this.relic1 instanceof Gauntlet || this.relic2 instanceof Gauntlet;
	}

	equippedWithOffering()
	{
		return this.relic1 instanceof Offering || this.relic2 instanceof Offering;
	}

	genjiGloveEquipped()
	{
		return this.relic1 instanceof GenjiGlove || this.relic2 instanceof GenjiGlove;
	}

	equippedWithAtlasArmlet()
	{
		return this.relic1 instanceof AtlasArmlet || this.relic2 instanceof AtlasArmlet;
	}

	equippedWithHeroRing()
	{
		return this.relic1 instanceof HeroRing || this.relic2 instanceof HeroRing;
	}

	equippedWith1HeroRing()
	{
		return (this.relic1 instanceof HeroRing 
				&& !this.relic2 instanceof HeroRing) || 
				(!this.relic1 instanceof HeroRing 
					&& this.relic2 instanceof HeroRing);
	}

	equippedWith2HeroRings()
	{
		return this.relic1 instanceof HeroRing && 
				this.relic2 instanceof HeroRing;
	}

	equippedWithEarring()
	{
		return this.relic1 instanceof Earring || 
				this.relic2 instanceof Earring;
	}

	equippedWith1Earring()
	{
		return (this.relic1 instanceof Earring 
				&& !this.relic2 instanceof Earring) 
				|| (!this.relic1 instanceof Earring && 
						this.relic2 instanceof Earring);
	}

	equippedWith2Earrings()
	{
		return this.relic1 instanceof Earring && this.relic2 instanceof Earring;
	}

	get rightHandHasWeapon(){ notNil(this.rightHand)};
	get leftHandHasWeapon(){ notNil(this.leftHand)};
	get rightHandHasNoWeapon(){ !this.rightHandHasWeapon()};
	get leftHandHasNoWeapon(){ !this.rightHandHasWeapon()};
	get hasZeroWeapons(){ this.rightHandHasNoWeapon() && this.leftHandHasNoWeapon()};

	oneOrZeroWeapons()
	{
		if(this.rightHandHasWeapon() && leftHandHasNoWeapon())
		{
			return true;
		}
		else if(this.rightHandHasNoWeapon() && this.leftHandHasWeapon())
		{
			return true;
		}
		else if(this.hasZeroWeapons())
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	get hitPoints()
	{
		return this._hitPoints;
	}
	set hitPoints(newValue)
	{
		var oldValue = _hitPoints;
		if(this._hitPoints != newValue)
		{
			this._hitPoints = newValue;
			this.subject.onNext({
				type: "hitPointsChanged", 
				target: this, 
				changeAmount: newValue - oldValue
			});
			if(oldValue <= 0 && newValue >= 1)
			{
				this.dead = false;
				this.subject.onNext({type: "noLongerSwoon", target: this});
			}
			else if(oldValue >= 1 && newValue <= 0)
			{
				this.dead = true;
				this.subject.onNext({type: "swoon", target: this});
			}
		}
	}

	get battleState()
	{
		return this._battleState;
	}

	set battleState(newState)
	{
		if(newState == this._battleState)
		{
			return;
		}
		var oldState = this._battleState;
		this._battleState = newState;
		this.subject.onNext({
			type: "battleStateChanged",
			target: this,
			oldBattleState: oldState,
			newBattleState: newState
		});
	}

	get row()
	{
		return this._row;
	}
	set row(newRow)
	{
		if(newRow === this._row)
		{
			return;
		}
		var oldRow = this._row;
		this._row = newRow;
		this.subject.onNext({
			type: "rowChanged",
			target: this,
			oldRow: oldRow,
			newRow: newRow
		});
	}

	constructor(speed = 80,
		vigor = 10,
		stamina = 10,
		magicPower = 10,
		magicBlock = 10,
		magicDefense = 10,
		row = Row.FRONT,
		hitPoints = 0,
		defense = 10,
		dead = false,
	    level = 3,
	    evade = 1,
	    battlePower = 1,
	    hitRate = 100)
	{
		this.generator = BattleTimer.battleTimer();
		this.percentage = 0;
		
		this.name = "";
		this._battleState = BattleState.WAITING;
		this._hitPoints = hitPoints;

		this.vigor = vigor;
		this.speed = speed;
		this.stamina = stamina;
		this.magicPower = magicPower;
		this.evade = evade;
		this.magicBlock = magicBlock;

		this.defense = defense;
		this.magicDefense = magicDefense;
		this.battlePower = battlePower;
		this.hitRate = hitRate;

		this.dead = dead;
		this.level = level;
		
		this.rightHand = null;
		this.leftHand = null;
		this.head = null;
		this.body = null;

		this.relic1 = null;
		this.relic2 = null;

		this._row = row;

		this.id = _INCREMENT++;

		this.subject = new Subject();
	}

	toggleRow()
	{
		if(row === Row.FRONT)
		{
			row = Row.BACK;
		}
		else
		{
			row = Row.FRONT;
		}
	}

}

export default Character