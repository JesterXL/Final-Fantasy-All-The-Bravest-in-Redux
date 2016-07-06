import GameLoop from "./com/jessewarden/ff6rx/core/GameLoop";
import BattleTimer from "./com/jessewarden/ff6rx/battle/BattleTimer";
import BattleTimer2 from "./com/jessewarden/ff6rx/battle/BattleTimer2";
import TextDropper from './com/jessewarden/ff6rx/components/TextDropper';
import BattleTimerBar from "./com/jessewarden/ff6rx/components/BattleTimerBar";
import PIXI from 'pixi.js';
import {Subject} from 'rx';
import _ from "lodash";
import Row from "./com/jessewarden/ff6rx/enums/Row";
import Relic from "./com/jessewarden/ff6rx/items/Relic";

export class Application
{

	initialize()
	{
		// this.canvasTag = document.getElementById('#stage');
		this.renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
		document.body.appendChild(this.renderer.view);
		this.stage = new PIXI.Container();
		this.stage.interactive = true;

		var style = {
		    font : 'bold italic 36px Arial',
		    fill : '#F7EDCA',
		    stroke : '#4a1850',
		    strokeThickness : 5,
		    dropShadow : true,
		    dropShadowColor : '#000000',
		    dropShadowAngle : Math.PI / 6,
		    dropShadowDistance : 6,
		    wordWrap : true,
		    wordWrapWidth : 440
		};

		var richText = new PIXI.Text('Text',style);
		richText.x = 30;
		richText.y = 180;
		this.stage.addChild(richText);

		this.animate();

		//this.testGameLoop();
		// this.testBattleTimer();
		// this.testTextDropper();
		// this.testBattleTimerBar();
		// this.testRow();
		// this.testRelic();
		this.testBattleTimer2();
	}

	animate()
	{
		var me = this;
		requestAnimationFrame(()=>
		{
			me.animate();
		});
		this.renderer.render(this.stage);
	}

	delayed(milliseconds, callback)
	{
		return new Promise((success, failure)=>
		{
			setTimeout(()=>
			{
				callback();
				success();
			}, milliseconds);
		});
	}

	testGameLoop()
	{
		this.gameLoop = new GameLoop();
		this.gameLoop.changes.subscribe((event)=>
		{
			console.log("event:", event);
		});
		this.gameLoop.start();
	}

	testBattleTimer()
	{
		this.gameLoop = new GameLoop();
		this.gameLoop.start();

		this.timer = new BattleTimer(this.gameLoop.changes, BattleTimer.MODE_PLAYER);
		this.timer.start();
		this.timer.changes.subscribe((event)=>
		{
			console.log("event:", event);
		});

		var me = this;
		me.delayed(300, ()=>
		{
			me.gameLoop.pause();
		});

		me.delayed(1000, ()=>
		{
			me.gameLoop.start();
		});
	}

	periodicStream(milliseconds)
	{
		return Rx.Observable.interval(milliseconds);
	}

	testTextDropper()
	{
		this.gameLoop = new GameLoop();
		this.gameLoop.start();

		var textDropper = new TextDropper(this.stage, this.gameLoop.changes);

		this.periodicStream(10).subscribe(()=>
		{
			var num = Math.round(Math.random() * 9999);
			textDropper.addTextDrop({x: Math.random() * 800, y: Math.random() * 800, width: 100, height: 72}, num);
		});

		// new Stream.periodic(new Duration(seconds: 1), (_)
		// {
		// 	print("boom");
		// 	return new Random().nextInt(9999);
		// })
		// .listen((int value)
		// {
		// 	print("chaka");
		// 	textDropper.addTextDrop(spot1, value);
		// });
	}

	testBattleTimerBar()
	{
		var gameLoop = new GameLoop();
		gameLoop.start();

		var bar = new BattleTimerBar(gameLoop.changes);
		this.stage.addChild(bar.container);
		bar.container.x = 20;
		bar.container.y = 20;

		var gameLoop = new GameLoop();
		var timer = new BattleTimer(gameLoop.changes, BattleTimer.MODE_PLAYER);
		gameLoop.start();
		timer.start();
		timer.changes
		.where(e => e.type === "progress")
		.subscribe((event)=>
		{
			bar.percentage = event.percentage;
		});
	}

	testRow()
	{
		console.log("row front:", Row.FRONT);
	}

	testRelic()
	{
		var cow = new Relic();
		console.log("cow:", cow);
		console.log(cow instanceof Relic);
		console.log(!cow instanceof Relic);
	}

	testBattleTimer2()
	{
		console.log("testBattleTimer2");
		var timer = BattleTimer2;
		console.log("timer:", timer);
		var sub;
		var lastVal;
		this.delayed(3000, ()=>
		{
			console.log("starting...");
			var source = timer.start(0);
			sub = source.subscribe(function(r)
			{
				console.log("next yo:", r);
				lastVal = r;
			},
			function(err)
			{
				console.log("err:", err);
			},
			function(r)
			{
				console.log("Completed, r:", r);
				sub.dispose();
				sub = undefined;
			});
		});
		

		this.delayed(5000, ()=>
		{
			console.log("stopping.");
			sub.dispose();
			sub = undefined;
		});

		this.delayed(6000, ()=>
		{
			console.log("resuming.");
			var source = timer.start(lastVal.gauge);
			sub = source.subscribe(function(r)
			{
				console.log("2next yo:", r);
			},
			function(err)
			{
				console.log("2err:", err);
			},
			function(r)
			{
				console.log("2Completed, r:", r);
				sub.dispose();
				sub = undefined;
			});
		});
	}
}

var app = new Application();
app.initialize();