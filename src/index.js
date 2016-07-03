import GameLoop from "./com/jessewarden/ff6rx/core/GameLoop";

export class Application
{

	initialize()
	{
		this.gameLoop = new GameLoop();
		this.gameLoop.subject.subscribe((event)=>
		{
			// console.log("event:", event);
		});
		this.gameLoop.start();
	}
}

var app = new Application();
app.initialize();