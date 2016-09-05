import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import "howler";

export default class GoblinSprite
{
	static get WIDTH(){ return 90};
	static get HEIGHT(){ return 96};

	get sprite()
	{
		return this._container;
	}

	constructor(entity)
	{
		this.entity = entity;
		this.type = 'ComponentSprite';
		this.player = false;
		this._container = new PIXI.Container();

		var prefix = 'src/com/jessewarden/ff6redux/sprites/goblin/';
		var stand = prefix + "goblin.png";
		this.standTexture  = new PIXI.Texture.fromImage(stand);
		this._sprite = new PIXI.Sprite(this.standTexture);
		this._container.addChild(this._sprite);
	}

	animateDeath()
	{
		var me = this;
		return new Promise((resolve)=>
		{
			var mySprite = me.sprite;
			TweenMax.to(mySprite, 1, {
				alpha: 0,
				onComplete: resolve
			})
		});
	}
}
