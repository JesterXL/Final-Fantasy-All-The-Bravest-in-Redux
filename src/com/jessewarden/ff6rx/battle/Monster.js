import Character from "./Character";
import BattleUtils from "../battle/BattleUtils";

class Monster extends Character
{
	static const LEAFER = "Leafer";
	static const ARENEID = "Areneid";

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