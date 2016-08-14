import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import "howler";
import { Subject } from 'rx';
import BattleTimerBar from '../../views/BattleTimerBar';

export default class WarriorSprite
{
	static get WIDTH(){ return 66};
	static get HEIGHT(){ return 66};

	get sprite()
	{
		return this._container;
	}

	constructor(entity)
	{
		this.entity = entity;
		this._container = new PIXI.Container();

		var prefix = 'src/com/jessewarden/ff6redux/sprites/warrior/';
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
		this._container.addChild(this.movie);

		var blueBlank = prefix + 'frame-blank.png';
		var blue1 = prefix + "frame-000000.png";
		var blue2 = prefix + "frame-000001.png";
		var blue3 = prefix + "frame-000002.png";
		var blue4 = prefix + "frame-000003.png";
		this.blueBlank = new PIXI.Texture.fromImage(blueBlank);
		this.blueLine1 = new PIXI.Texture.fromImage(blue1);
		this.blueLine2 = new PIXI.Texture.fromImage(blue2);
		this.blueLine3 = new PIXI.Texture.fromImage(blue3);
		this.blueLine4 = new PIXI.Texture.fromImage(blue4);
		this.blueAttack = new PIXI.extras.MovieClip([
			this.blueBlank,
			this.blueLine1,
			this.blueLine2,
			this.blueLine3,
			this.blueLine4,
			this.blueBlank
		]);
		this._container.addChild(this.blueAttack);
		this.blueAttack.loop = false;
		this.blueAttack.gotoAndStop(0);
		this.blueAttack.x = -100;
		this.blueAttack.y = -47;

		this.hitSound = new Howl({
		  urls: ['src/audio/claw-slash.wav']
		});

		this.facingLeft = true;

		this.battleTimerBar = new BattleTimerBar();
		this._container.addChild(this.battleTimerBar.sprite);
		this.battleTimerBar.sprite.x = Warrior.WIDTH / 2 - this.battleTimerBar.sprite.width / 2;
	}

	setPercentage(value)
	{
		this.battleTimerBar.percentage = value;
		this.battleTimerBar.render();
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

	hitAnimation()
	{
		if(_.isNil(this.hitAnimationTimeline))
		{
			this.hitAnimationTimeline = new TimelineMax();
			var tl = this.hitAnimationTimeline;
			var startX = 0;
			const movement = 20;
			tl.to(this.movie, 0.08, {x: startX - movement, ease: Linear.easeOut})
			.to(this.movie, 0.08, {x: startX + movement, ease: Linear.easeOut})
			.to(this.movie, 0.08, {x: startX - movement, ease: Linear.easeOut})
			.to(this.movie, 0.08, {x: startX + movement, ease: Linear.easeOut})
			.to(this.movie, 0.08, {x: startX - movement, ease: Linear.easeOut})
			.to(this.movie, 0.01, {x: 0, ease: Linear.easeOut});
		}
		tl.restart();
	}

	raise()
	{
		this.movie.textures = [this.raiseTexture];
		this.showFirstFrame();
	}

	attackAnimation()
	{
		this.blueAttack.animationSpeed = 0.4;
		this.blueAttack.gotoAndStop(1);
		this.blueAttack.play();
		this.hitSound.play();
	}

	faceRight()
	{
		if(this.facingLeft)
		{
			this.facingLeft = false;
		
			var w = this.movie.width;
			this.movie.width = -w;
			this.movie.x += w;
		}
	}

	faceLeft()
	{
		if(this.facingLeft === false)
		{
			this.facingLeft = true;
			this.movie.width = -this.movie.width;
			this.movie.x = 0;
		}
	}

	leapTowardsTarget(targetX, targetY)
	{
		var me = this;
		return new Promise((success)=>
		{
			me.battleTimerBar.sprite.visible = false;
			var mySprite = me.sprite;
			var startWX = mySprite.x;
			var startWY = mySprite.y;
			// welcome kids to lessons in not paying attention in math class
			var dist = Math.sqrt(Math.pow(targetX - startWX, 2) + Math.pow(targetY - startWY, 2));
			var half = dist / 2;
			var halfX = Math.abs(targetX - startWX);
			var halfY = Math.abs(targetY - startWY);
			var middleY = Math.min(startWY, targetY);
			middleY /= 2;
			middleY = -middleY;
			var middleX = halfX;

			TweenMax.to(me.sprite, 0.7, {
				bezier: {
					type: 'thru',
					values: [
				{ x: startWX, y: startWY}, 
				{x: middleX, y: middleY},
				{ x: targetX, y: targetY}
			],
					curviness: 2
				},
				ease: Linear.easeInOut,
			    onStart: ()=>
				{
					me.attack();
				},
				onComplete: success
			});
		});
	}

	firstAttack()
	{
		var me = this;
		return new Promise((resolve)=>
		{
			TweenMax.to(me.sprite, 0.3, {
				onStart: ()=>
				{
					me.attack2();
					me.attackAnimation();
				},
				onComplete: resolve
			});
		});
	}

	secondAttack()
	{
		var me = this;
		return new Promise((resolve)=>
		{
			var mySprite = me.sprite;
			var tl = new TimelineMax();
			tl.add( TweenMax.to(mySprite, 0.3, {
				onStart: ()=>
				{
					me.attack();
				}
			}));
			tl.add( TweenMax.to(mySprite, 0.3, {
				onStart: ()=>
				{
					me.attack2();
					me.attackAnimation();
				},
				onComplete: resolve
			}));
		});
	}

	leapBackToStartingPosition(startX, startY, middleX, middleY)
	{
		console.log("leapBackToStartingPosition, startX: " + startX + ", startY: " + startY + ", middleX: " + middleX + ", middleY: " + middleY);
		var me = this;
		return new Promise((resolve)=>
		{
			var mySprite = me.sprite;
			console.log("mySprite x: " + mySprite.x + ", y:" + mySprite.y);
			var tl = new TimelineMax();
			tl.add( TweenMax.to(mySprite, 0.7, {
				bezier: {
					type: 'thru',
					values: [
						{ x: mySprite.x, y: mySprite.y},
						{ x: middleX, y: middleY},
						{ x: startX, y: startY}
					],
					curviness: 2
				},
				ease: Linear.easeInOut, onStart: ()=>
			{
				me.raise();
				me.faceRight();
			},
			onComplete: ()=>
			{
				me.stand();
				me.faceLeft();
				me.battleTimerBar.sprite.visible = true;
				resolve();
			}}));
		});
	}
}