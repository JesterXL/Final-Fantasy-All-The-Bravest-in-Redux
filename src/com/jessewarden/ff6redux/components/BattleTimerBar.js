import PIXI from "pixi.js";
import _ from "lodash";
import StateMachine from "../core/StateMachine";
import "gsap";

class BattleTimerBar
{

	static get ROUND(){ return 2};
	static get WIDTH(){ return 70};
	static get HEIGHT(){ return 20};

	get percentage()
	{
		return this._percentage;
	}

	set percentage(value)
	{
		if(value === null)
		{
			value = 0;
		}

		if(this._percentage === value)
		{
			return;
		}
		value = _.clamp(value, 0, 1);
		this._percentage = value;
		this.percentageDirty = true;
		if(value === 1)
		{
			this.fsm.changeState("ready");
		}
		else
		{
			this.fsm.changeState("loading");
		}
	}

	get container()
	{
		return this._container;
	}

	constructor()
	{
		this._percentage = 1;
		this.percentageDirty = false;
		// this.fsm = undefined;
		// this.flash = new TimelineLite();
		this.flashDirty = false;

		this._container = new PIXI.Container();
		this.graphics = new PIXI.Graphics();
		this.container.addChild(this.graphics);

		this.redraw();

		var me = this;
		this.fsm = new StateMachine();
		this.fsm.addState("loading");
		this.fsm.addState("ready");
		/*
		enter: ()=>
		{
			me.flash = new TimelineLite();
			const SPEED = 0.05;
			flash.to(green, SPEED)
				..onStart = () => fsm.changeState("readyWhite"));
			flash.add(new Tween(green, SPEED, TransitionFunction.linear)
				..onStart = () => fsm.changeState("readyGold"));
			flash.add(new Tween(green, SPEED, TransitionFunction.linear)
				..onStart = () => fsm.changeState("readyWhite"));
			flash.add(new Tween(green, SPEED, TransitionFunction.linear)
				..onStart = () => fsm.changeState("readyGold"));
			flash.add(new Tween(green, SPEED, TransitionFunction.linear)
				..onStart = () => fsm.changeState("readyWhite"));
			flash.add(new Tween(green, SPEED, TransitionFunction.linear)
				..onStart = () => fsm.changeState("readyGold"));
			flash.add(new Tween(green, SPEED, TransitionFunction.linear)
				..onStart = () => fsm.changeState("readyWhite"));
			flash.add(new Tween(green, SPEED, TransitionFunction.linear)
				..onStart = () => fsm.changeState("idle"));
			renderLoop.juggler.add(flash);
		});
		*/
		this.fsm.addState("readyWhite",
		undefined,
		()=>
		{
			flashDirty = true;
		});
		this.fsm.addState("readyGold",
		undefined,
		()=>
		{
			flashDirty = true;
		});
		this.fsm.addState("idle",
		undefined,
		()=>
		{
			this.visible = false;
		},
		undefined,
		()=>
		{
			this.visible = true;
		});
		this.fsm.initialState = "idle";

		// TODO: clean up subscription
		// var me = this;
		// gameLoopStream
		// .where(e => e.type === 'tick')
		// .subscribe((event)=>
		// {
		// 	me.render();
		// });
	}

	redraw()
	{
		this.graphics.beginFill(0x000080);
		this.graphics.lineStyle(3, 0xFFFFFF, 1);
		this.graphics.drawRoundedRect(0, 
									0, 
									BattleTimerBar.WIDTH, 
									BattleTimerBar.HEIGHT, 
									BattleTimerBar.ROUND);
		
		var OFFSET = 1;
		var percentageWidth = BattleTimerBar.WIDTH * this._percentage - OFFSET * 2;
		percentageWidth = _.clamp(percentageWidth, 0, BattleTimerBar.WIDTH);
		this.graphics.beginFill(0xffd700);
		this.graphics.lineStyle(0);
		//this.graphics.moveTo(OFFSET, OFFSET);

		this.graphics.drawRoundedRect(OFFSET, 
			OFFSET,
			percentageWidth, 
			BattleTimerBar.HEIGHT - OFFSET * 2,
			BattleTimerBar.ROUND);
		
		//this.graphics.drawRect(0, 0, percentageWidth, BattleTimerBar.HEIGHT - OFFSET * 2);
	}

	render()
	{
		if(this.percentageDirty || this.flashDirty)
		{
			this.graphics.clear();
		}

		if(this.percentageDirty)
		{
			this.percentageDirty = false;
			this.redraw();
		}

		// if(this.flashDirty)
		// {
		// 	this.flashDirty = false;
		// 	this..graphics.rectRound(ROUND/2, ROUND/2, ((WIDTH - ROUND) * _percentage), HEIGHT - ROUND, ROUND, ROUND);
		// 	if(fsm.currentState.name == "readyWhite")
		// 	{
		// 		green.graphics.fillColor(Color.White);
		// 	}
		// 	else if(fsm.currentState.name == "readyGold")
		// 	{
		// 		green.graphics.fillColor(Color.Gold);
		// 	}
		// }
	}
}

export default BattleTimerBar