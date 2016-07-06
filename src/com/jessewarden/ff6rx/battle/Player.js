import Character from "./Character";

class Player extends Character
{
	static const WARRIOR = "Warrior";
	static const BLACK_MAGE = "Black Mage";
	static const THIEF = "Thief";

	get type()
	{
		return this._type;
	}

	Player(type = WARRIOR,
	    	name = 'Default',
			speed = 1)
	{
		this._type = type;
		this.name = name;
		this.speed = speed;
	}
}

export default Player