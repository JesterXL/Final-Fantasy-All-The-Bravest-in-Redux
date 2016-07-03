import GameLoop from "./com/jessewarden/ff6rx/core/GameLoop";
import BattleTimer from "./com/jessewarden/ff6rx/battle/BattleTimer";
import TextDropper from './com/jessewarden/ff6rx/components/TextDropper';
import PIXI from 'pixi.js';
import {Subject} from 'rx';

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
		this.testTextDropper();
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

		this.timer = new BattleTimer(this.gameLoop.changes, BattleTimer.MODE_CHARACTER);
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

		this.periodicStream(3000).subscribe(()=>
		{
			var num = Math.round(Math.random() * 9999);
			textDropper.addTextDrop({x: 200, y: 200, width: 100, height: 72}, num);
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
}

var app = new Application();
app.initialize();