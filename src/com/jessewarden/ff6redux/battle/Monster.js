import Character from "./Character";
import BattleUtils from "./BattleUtils";

class Monster extends Character
{
	static get LEAFER() { return "Leafer"};
	static get ARENEID() { return "Areneid"};

	get type()
	{
		return this._type;
	}

	constructor(type = Monster.LEAFER)
	{
		super();

		this._type = type;
		this.vigor = BattleUtils.getRandomMonsterVigor();
	}
}

export default Monster