import GameLoop from "./com/jessewarden/ff6rx/core/GameLoop";
import BattleTimer from "./com/jessewarden/ff6rx/battle/BattleTimer";

export class Application
{

	initialize()
	{
		//this.testGameLoop();
		this.testBattleTimer();
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
		console.log("testBattleTimer");
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
}

var app = new Application();
app.initialize();