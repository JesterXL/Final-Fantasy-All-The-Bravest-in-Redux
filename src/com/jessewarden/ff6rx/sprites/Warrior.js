import PIXI from "pixi.js";
import _ from "lodash";
import StateMachine from "../core/StateMachine";
import "gsap";

class Warrior
{
	static get WIDTH(){ return 66};
	static get HEIGHT(){ return 66};

	get sprite()
	{
		return this._sprite;
	}

	constructor()
	{
		this.texture = PIXI.Texture.fromImage("src/com/jessewarden/ff6rx/sprites/warrior.png");
		this._sprite = new PIXI.Sprite(this.texture);
	}
}

export default Warrior