import Character from "./Character";
import BattleUtils from "../battle/BattleUtils";

class Monster extends Character
{
	static get LEAFER() { return "Leafer"};
	static get ARENEID() { return "Areneid"};

	get type()
	{
		return this._type;
	}

	Monster(type = LEAFER)
	{
		this._type = type;
		this.vigor = BattleUtils.getRandomMonsterVigor();
	}
}

export default Monster