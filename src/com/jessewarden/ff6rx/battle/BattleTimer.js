import {Subject} from "rx";

class BattleTimer
{
	static get MODE_PLAYER() { return "player"; }
	static get MODE_MONSTER() { return "monster"; }

	static get EFFECT_NORMAL() { return 96; }
	static get EFFECT_HASTE() { return 126; }
	static get EFFECT_SLOW() { return 48; }

	static get MAX() { return 65536; }
	static get TIME_SLICE() { return 33; }

	// StreamController<BattleTimerEvent> _streamController;
	// Stream<BattleTimerEvent> stream;
	// Stream<GameLoopEvent> _gameLoopStream;
	// StreamSubscription _gameLoopStreamSubscription;

	get progress()
	{
		return this.gauge / BattleTimer.MAX;
	}
	get enabled()
	{
		return this._enabled;
	}

	set enabled(newValue)
	{
		this._enabled = newValue;
		if (this._enabled == false)
		{
			this.pause();
		}
	}

	get mode()
	{
		return this._mode;
	}

	get changes()
	{
		return this._subject.asObservable();
	}

	set mode(newValue)
	{
		this._mode = newValue;
		if (this._mode == BattleTimer.MODE_PLAYER)
		{
			this.modeFunction = this.onCharacterTick;
		} else
		{
			this.modeFunction = this.onMonsterTick;
		}
	}

	constructor(_gameLoopStream, mode = BattleTimer.MODE_PLAYER)
	{
		this._subject = new Subject();

		this.lastTick = 0;

		this.speed = 200;
		this.battleSpeed = 3;
		this.effect = BattleTimer.EFFECT_NORMAL;
		this._mode = undefined;

		this.gauge = 0;
		this.modeFunction = undefined;
		this._enabled = true;
		this.running = false;
		this.completed = false;

		// _streamController = new StreamController<BattleTimerEvent>(onPause: _onPause, onResume: _onResume);
		// stream = _streamController.stream;
		this._gameLoopStream = _gameLoopStream;
		this.mode = mode;
	}

	_onPause()
	{
		this.pause();
	}

	_onResume()
	{
		this.start();
	}

	startListenToGameLoop()
	{
		var me = this;
		if(me._gameLoopStreamSubscription == null)
		{
			me._gameLoopStreamSubscription = me._gameLoopStream
			.where(event => event.type === "tick")
			.subscribe((event)=>
			{
				me.tick(event.time);
			});
		}
	}

	stopListenToGameLoop()
	{
		if(this._gameLoopStreamSubscription != null)
		{
			this._gameLoopStreamSubscription.dispose();
			this._gameLoopStreamSubscription = undefined;
		}
	}

	start()
	{
		if(this.enabled == false)
		{
			return false;
		}
		if(this.running == false)
		{
			this.running = true;
			this.startListenToGameLoop();
			this._subject.onNext({type: 'started', target: this});
		}
		return true;
	}

	pause()
	{
		if(this.running)
		{
			this.running = false;
			this.stopListenToGameLoop();
			this._subject.onNext({type: 'paused', target: this});
		}
	}

	reset()
	{
		this.pause();
		this.gauge = 0;
		this.lastTick = 0;
		this.completed = false;
		this._subject.onNext({type: 'reset', target: this});
	}

	tick(time)
	{
		var me = this;
		var wrapper = ()=>
		{
			return me.modeFunction.apply(me, arguments);
		};
		var modeFunc = wrapper;
		if (modeFunc == null)
		{
			return;
		}

		this.lastTick = this.lastTick + Math.round(time);
		var result = Math.floor(this.lastTick / BattleTimer.TIME_SLICE);
		if(result > 0)
		{
			var remainder = this.lastTick - (result * BattleTimer.TIME_SLICE);
			this.lastTick = remainder;
			// TODO: if someone pauses this while running modeFunc
			// we should respect this... this should be a Stream
			// so we can respect subscriber control
			while (result > 0)
			{
				modeFunc();
				result--;
			}
			var percentage = this.gauge / BattleTimer.MAX;
//			print("gauge: $gauge, MAX: $MAX, percentage: $percentage");
//			print("---percentage: $percentage");
			if(percentage == null)
			{
				throw new Error("This can't be null home slice dice mice thrice lice kites... kites doesn't rhyme.");
			}
			if(this.gauge < BattleTimer.MAX)
			{
				this._subject.onNext({type: 'progress', target: this, percentage: percentage});
			}
			else
			{
				this.completed = true;
				this.gauge = BattleTimer.MAX;
				this.running = false;
				this.stopListenToGameLoop();
				this._subject.onNext({type: 'progress', target: this, percentage: 1});
				this._subject.onNext({type: 'complete', target: this});
			}
		}
	}

	dispose()
	{
		this.running = false;
		this.stopListenToGameLoop();
	}

	onCharacterTick()
	{
		var result = (((this.effect * (this.speed + 20)) / 16));
		this.gauge += Math.round(result);
	}

	// ((96 * (Speed + 20)) * (255 - ((Battle Speed - 1) * 24))) / 16
	onMonsterTick()
	{
		/* 2nd try and I still failed, lol! I think home slice has like a * where he meant to have a /... andyway,
		I cannot for the life of me get a reasonable value from this calculation.
		 */
//		print("monster tick");
//		num result = ((effect * (speed + 20)) * (255 - ((battleSpeed - 1) * 24))) / 16;
//		gauge += result.round();
//		print("result: $result and gauge: $gauge");
//		if(gauge >= MAX)
//		{
//			gauge = MAX;
//			_streamController.add(new BattleTimerEvent(BattleTimerEvent.COMPLETE, this));
//		}

		var result = (((this.effect * (this.speed + 15)) / 16));
		this.gauge += result.round();
		// dispatch progress = gauge / MAX;
		if(this.gauge >= BattleTimer.MAX && this.completed === false)
		{
//			print("gauge is larger than MAX, dispatching complete.");
			// dispatch complete
			this.completed = true;
			this.gauge = BattleTimer.MAX;
			this._subject.onNext({type: 'complete', target: this});
		}
	}
}

export default BattleTimer
