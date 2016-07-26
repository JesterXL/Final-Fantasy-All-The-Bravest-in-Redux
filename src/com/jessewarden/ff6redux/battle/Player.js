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

	constructor(type = Player.WARRIOR,
	    	name = 'Default',
			speed = 1)
	{
		super(speed);

		this._type = type;
		this.name = name;
		
		this.ready = false;
	}
}

export default Player