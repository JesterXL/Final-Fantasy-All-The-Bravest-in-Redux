import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";

class Warrior
{
	static get WIDTH(){ return 66};
	static get HEIGHT(){ return 66};

	get sprite()
	{
		return this.movie;
	}

	constructor()
	{
		var prefix = 'src/com/jessewarden/ff6rx/sprites/warrior/';
		var attack = prefix + "warrior_attack.png";
		var attack2 = prefix + 'warrior_attack2.png';
		var hit    = prefix + "warrior_hit.png";
		var hurt   = prefix + "warrior_hurt.png";
		var raise  = prefix + "warrior_raise.png";
		var stand  = prefix + "warrior_stand.png";
		var walk   = prefix + "warrior_walk.png";
		this.attackTexture = new PIXI.Texture.fromImage(attack);
		this.attack2Texture = new PIXI.Texture.fromImage(attack2);
		this.hitTexture    = new PIXI.Texture.fromImage(hit);
		this.hurtTexture   = new PIXI.Texture.fromImage(hurt);
		this.raiseTexture  = new PIXI.Texture.fromImage(raise);
		this.standTexture  = new PIXI.Texture.fromImage(stand);
		this.walkTexture   = new PIXI.Texture.fromImage(walk);

		var warriorImages = [
			attack,
			hit,
			hurt,
			raise,
			stand,
			walk
		];
		
		this.textureArray = [
			this.attackTexture,
			this.attack2Texture,
			this.hitTexture,
			this.hurtTexture,
			this.raiseTexture,
			this.standTexture,
			this.walkTexture
		];
		this.movie = new PIXI.extras.MovieClip(this.textureArray);
		this.movie.animationSpeed = 0.1;
	}

	play()
	{
		this.movie.play();
	}

	gotoAndStop(frame)
	{
		this.movie.gotoAndStop(frame);
	}

	showFirstFrame()
	{
		this.movie.gotoAndStop(1);
	}

	walk()
	{
		this.movie.textures = [this.walkTexture];
		this.showFirstFrame();
	}

	stand()
	{
		this.movie.textures = [this.standTexture];
		this.showFirstFrame();
	}

	attack()
	{
		this.movie.textures = [this.attackTexture];
		this.showFirstFrame();
	}

	attack2()
	{
		this.movie.textures = [this.attack2Texture];
		this.showFirstFrame();
	}

	hurt()
	{
		this.movie.textures = [this.hurtTexture];
		this.showFirstFrame();
	}

	hit()
	{
		this.movie.textures = [this.hitTexture];
		this.showFirstFrame();
	}

	raise()
	{
		this.movie.textures = [this.raiseTexture];
		this.showFirstFrame();
	}
}

export default Warrior