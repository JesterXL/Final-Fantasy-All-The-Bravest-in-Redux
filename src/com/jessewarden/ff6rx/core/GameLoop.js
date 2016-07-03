import {Subject} from "rx";

class GameLoop
{
	constructor()
	{
		/*
		 _streamController = new StreamController<GameLoopEvent>(onPause: _onPause,
	    onResume: _onResume);
	    stream = _streamController.stream.asBroadcastStream();
	    mock = new WindowMock();
	    mock.start();
	    */

	    this.lastTick = 0;
	    this.running = false;
	    this.resetDirty = false;
	    this.pausedTime = false;
	    this._subject = new Subject();
	}

	tick(time)
	{
		if(this.running)
		{
			if(this.resetDirty)
			{
				this.lastTick = time;
			}

			if(this.pausedTime != 0)
			{
				var timeElapsed = new Date().valueOf() - this.pausedTime;
				this.lastTick -= timeElapsed;
				time -= timeElapsed;
				this.pausedTime = 0;
			}

			var difference = time  - this.lastTick;
			this.lastTick = time;
			 // _streamController.add(new GameLoopEvent(GameLoopEvent.TICK, time: difference));
			 // console.log("difference:", difference);
			this._subject.onNext({type: "tick", time: difference});
			this.request();
		}
	}

	pause()
	{
		this.running = false;
	    this.pausedTime = new Date().valueOf();
	    this._subject.onNext({type: "paused"});
	}

	reset()
	{
		this.resetDirty = true;
		 // _streamController.add(new GameLoopEvent(GameLoopEvent.RESET));
		this._subject.onNext({type: "reset"});
	}

	start()
	{
		if(this.running === false)
		{
			this.running = true;
			this.request();
			// _streamController.add(new GameLoopEvent(GameLoopEvent.STARTED));
			this._subject.onNext({type: "started"});
		}
	}

	request()
	{
		var me = this;
		window.requestAnimationFrame((time)=>{
			me.tick(time);
		});
	}

	get changes()
	{
		return this._subject.asObservable();
	}
}

export default GameLoop