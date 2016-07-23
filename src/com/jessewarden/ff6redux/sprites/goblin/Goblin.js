import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import "howler";

class Goblin
{
	static get WIDTH(){ return 90};
	static get HEIGHT(){ return 96};

	get sprite()
	{
		return this._container;
	}

	constructor()
	{
		this._container = new PIXI.Container();

		var prefix = 'src/com/jessewarden/ff6redux/sprites/goblin/';
		var stand = prefix + "goblin.png";
		this.standTexture  = new PIXI.Texture.fromImage(stand);
		this._sprite = new PIXI.Sprite(this.standTexture);
		this._container.addChild(this._sprite);
	}
}

export default Goblin