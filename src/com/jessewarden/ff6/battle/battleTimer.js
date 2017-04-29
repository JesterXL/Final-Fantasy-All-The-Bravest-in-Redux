const log = console.log;

const _ = require('lodash');

export const MODE_PLAYER   = 'player';
export const MODE_MONSTER  = 'monster';

export const EFFECT_NORMAL = 96;
export const EFFECT_HASTE  = 126;
export const EFFECT_SLOW   = 48;

export const MAX_GAUGE     = 65536;
const TIME_SLICE    = 33;
const THIRTY_TIMES_A_SECOND = 1000 / 30;

export const getPercentage = (gauge) =>
{
	return gauge / MAX_GAUGE;
};

export const characterTick = (effect, speed, gauge)=>
{
	const result = (((effect * (speed + 20)) / 16));
	gauge += Math.round(result);
    return gauge;
};
// Normal speed:

// ((96 * (Speed + 20)) * (255 - ((Battle Speed - 1) * 24))) / 16

// If Hasted:

// ((126 * (Speed + 20)) * (255 - ((Battle Speed - 1) * 24))) / 16

// If Slowed:

// ((48 * (Speed + 20)) * (255 - ((Battle Speed - 1) * 24))) / 16

// export function *timerBrowserNotNode()
// {
// 	let time = performance.now();
// 	let lastTick = time;
// 	yield {time, difference: 0};
// 	while(true)
// 	{
// 		time = performance.now();
// 		yield {time, difference: time - lastTick};
// 	}
// }

export class Timer
{
	constructor(entity)
	{
		const me = this;
		me.entity = entity;
		me.running = false;
		me.tickBound = me.tick.bind(me);
	}

	tick(time)
	{
		const me = this;
		const now = performance.now();
		const previousTick = me.lastTick;
		me.difference = now - me.lastTick;
		me.lastTick = now;
		if(me.running === true)
		{
			window.requestAnimationFrame(me.tickBound);
			if(me.tickCallback)
			{
				me.tickCallback(time, me.difference, now, previousTick);
			}
		}
	}

	startTimer(window, callback)
	{
		const me = this;
		me.running = true;
		me.tickCallback = callback;
		me.lastTick = performance.now();
		window.requestAnimationFrame(me.tickBound);
	}

	stopTimer()
	{
		const me = this;
		me.running = false;
		delete me.tickCallback;
	}

	// resume()
	// {
	// 	const me = this;
	// 	me.running = true;
	// 	me.window.requestAnimationFrame(me.tickBound);
	// }
}

// TODO: make monster mode work, I don't get the algo man
export class BattleTimer
{
	get complete()
	{
		const me = this;
		return me.percentage === 1 && me.gauge === MAX_GAUGE
	}

	constructor(entity, characterEntity, counter=0, gauge=0, effect=EFFECT_NORMAL, mode=MODE_PLAYER, speed=1)
	{
		const me = this;
		me.entity = entity;
		me.timer = new Timer(entity);
		me.characterEntity = characterEntity;
		me.counter = counter;
		me.gauge = gauge;
		me.effect = effect;
		me.mode = mode;
		me.speed = speed;
	}

	reset()
	{
		const me = this;
		me.counter = 0;
		me.gauge = 0;
	}

	resetAndStartTimer()
	{
		const me = this;
		me.reset();
		me.startTimer(me.window, me.doneCallback, me.progressCallback);
	}

	// resume()
	// {
	// 	const me = this;
	// 	me.timer.resume();
	// }

	startTimer(window, doneCallback, progressCallback)
	{
		const me = this;
		me.window = window;
		me.doneCallback = doneCallback;
		me.progressCallback = progressCallback;
		
		if(_.isNil(me.thirtyMillisecondCounter))
		{
			me.thirtyMillisecondCounter = 0;
		}
		me.timer.startTimer(window, (time, difference, now, previousTick)=>
		{
			me.thirtyMillisecondCounter += difference;
			if(me.thirtyMillisecondCounter >= THIRTY_TIMES_A_SECOND)
			{
				me.thirtyMillisecondCounter = 0;
				me.counter++;
				me.gauge = characterTick(me.effect, me.speed, me.gauge);
				if(me.gauge >= MAX_GAUGE)
				{
					me.gauge = MAX_GAUGE;
					me.percentage = 1;
					me.stopTimer();
					me.completedTime = now;
					me.doneCallback({
						entity: me.entity,
						characterEntity: me.characterEntity,
						percentage: 1, 
						gauge: me.gauge
					});
					return;
				}
				if(me.progressCallback)
				{
					me.percentage = getPercentage(me.gauge);
					me.progressCallback({
						entity: me.entity,
						characterEntity: me.characterEntity,
						percentage: me.percentage, 
						gauge: me.gauge
					});
				}
				
			}
		});
	}

	stopTimer()
	{
		const me = this;
		me.timer.stopTimer();
	}
}
