import _ from 'lodash';

export const MODE_PLAYER   = 'player';
export const MODE_MONSTER  = 'monster';

export const EFFECT_NORMAL = 96;
export const EFFECT_HASTE  = 126;
export const EFFECT_SLOW   = 48;

const MAX_GAUGE     = 65536;
const TIME_SLICE    = 33;

export const getPercentage = (gauge) =>
{
	return gauge / MAX_GAUGE;
};

// export const hrtimeToMilliseconds = (hrtime) => (hrtime[0] * 1000) + (hrtime[1] / 1000000);

// export function *tickerNode()
// {
// 	let time = process.hrtime();
// 	let lastTick = [time[0], time[1]];
// 	yield hrtimeToMilliseconds(time);
// 	while(true)
// 	{
// 		time = process.hrtime(lastTick);
// 		lastTick = [time[0], time[1]];
// 		yield hrtimeToMilliseconds(time);
// 	}
// }

export function *tickerBrowser()
{
	let time = performance.now();
	let lastTick = time;
	yield {time, difference: 0};
	while(true)
	{
		time = performance.now();
		yield {time, difference: time - lastTick};
	}
}

export function *battleTimerCounter()
{
	let counter = 0;
	let lastTick = 0;
	let tickerBrowser = tickerBrowser();
	let timeAndDifference = tickerBrowser.next();
	while(true)
	{
		yield counter;
		lastTick += time;
		let result = Math.floor(lastTick / TIME_SLICE);
		if(result > 0)
		{
			let remainder = lastTick  - (result * TIME_SLICE);
			lastTick = remainder;
			while(result > 0)
			{
				gauge = characterTick(effect, speed, gauge);
				result--;
			}
			if(gauge > MAX_GAUGE)
			{
				gauge = MAX_GAUGE;
			}
			var percentage = getPercentage(gauge);
			if(gauge < MAX_GAUGE)
			{
				yield {percentage: percentage, gauge: gauge};

			}
			else
			{
				// observer.onCompleted();
				return {percentage: 1, gauge: gauge};
			}
		}
		else
		{
			yield {percentage: gauge / MAX_GAUGE, gauge: gauge};
		}
	}

}

export function *battleTimer(INTERVAL=0, initialGauge = 0, speed = 100, effect = EFFECT_NORMAL)
{
	var gauge = initialGauge;
	var time = 0;
	var lastTick = 0;
	
	while(true)
	{
		time = yield
		console.log("time:", time);
		lastTick = lastTick + Math.round(time);
		var result = Math.floor(lastTick / TIME_SLICE);
		if(result > 0)
		{
			var remainder = lastTick - (result * TIME_SLICE);
			lastTick = remainder;
			// TODO: if someone pauses this while running modeFunc
			// we should respect this... this should be a Stream
			// so we can respect subscriber control
			while (result > 0)
			{
				gauge = characterTick(effect, speed, gauge);
				result--;
			}
			console.log("gauge:", gauge);
			if(gauge > MAX_GAUGE)
			{
				gauge = MAX_GAUGE;
			}
			var percentage = getPercentage(gauge);
			if(gauge < MAX_GAUGE)
			{
				yield {percentage: percentage, gauge: gauge};

			}
			else
			{
				// observer.onCompleted();
				return {percentage: 1, gauge: gauge};
			}
		}
		else
		{
			yield {percentage: gauge / MAX_GAUGE, gauge: gauge};
		}
	}
}

export function characterTick(effect, speed, gauge)
{
	var result = (((effect * (speed + 20)) / 16));
	gauge += Math.round(result);
    return gauge;
}