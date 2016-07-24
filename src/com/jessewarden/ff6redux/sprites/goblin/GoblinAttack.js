import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import "howler";

class GoblinAttack
{
	static get WIDTH(){ return 66};
	static get HEIGHT(){ return 66};

	get sprite()
	{
		return this._container;
	}

	constructor()
	{
		this._container = new PIXI.Container();

		var prefix = 'src/com/jessewarden/ff6redux/sprites/goblin/';

		var red1 = prefix + 'goblin-attack/frame-000000.png';
		var red2 = prefix + "goblin-attack/frame-000001.png";
		var red3 = prefix + "goblin-attack/frame-000002.png";
		var red4 = prefix + "goblin-attack/frame-000003.png";
		var red5 = prefix + 'goblin-attack/frame-blank.png';
		this.red1 = new PIXI.Texture.fromImage(red1);
		this.red2 = new PIXI.Texture.fromImage(red2);
		this.red3 = new PIXI.Texture.fromImage(red3);
		this.red4 = new PIXI.Texture.fromImage(red4);
		this.red5 = new PIXI.Texture.fromImage(red5);
		this.redAttack = new PIXI.extras.MovieClip([
			this.red1,
			this.red2,
			this.red3,
			this.red4,
			this.red5
		]);
		this._container.addChild(this.redAttack);
		this.redAttack.loop = false;
		this.redAttack.gotoAndStop(0);

		this.hitSound = new Howl({
		  urls: ['src/audio/claw-slash.wav']
		});

		this.facingLeft = true;
	}

	play()
	{
		this.redAttack.animationSpeed = 0.4;
		this.redAttack.gotoAndStop(1);
		this.redAttack.play();
		this.hitSound.play();
		return new Promise((success)=>
		{
			this.redAttack.onComplete = success;
		});
	}
}

export default GoblinAttack