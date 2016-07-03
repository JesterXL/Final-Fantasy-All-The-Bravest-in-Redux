import GameLoop from "./com/jessewarden/ff6rx/core/GameLoop";
import BattleTimer from "./com/jessewarden/ff6rx/battle/BattleTimer";

export class Application
{

	initialize()
	{
		//this.testGameLoop();
		this.testBattleTimer();
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

	}
}

var app = new Application();
app.initialize();