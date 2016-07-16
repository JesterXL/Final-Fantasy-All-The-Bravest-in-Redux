import Character from "./Character";

class Player extends Character
{
	static get WARRIOR (){ return "Warrior"};
	static get BLACK_MAGE (){ return "Black Mage"};
	static get THIEF (){return "Thief"};

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