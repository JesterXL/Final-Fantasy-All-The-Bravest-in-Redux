import Character from "./Character";
import BattleTimer2 from "./BattleTimer2";

class Player extends Character
{
	static get WARRIOR (){ return "Warrior"};
	static get BLACK_MAGE (){ return "Black Mage"};
	static get THIEF (){return "Thief"};
	static get idSeed(){this._idSeed = 0;};
	static set idSeed(val){this._idSeed = val;};

	get type()
	{
		return this._type;
	}

	constructor(type = Player.WARRIOR,
	    	name = 'Default',
			speed = 1)
	{
		super(speed);

		this._type = type;
		this.name = name;

		this.generator = BattleTimer2.battleTimer()
		this.percentage = 0;
		this.ready = false;
		this.id = Player.idSeed + 1;
		Player.idSeed++;
	}
}

export default Player