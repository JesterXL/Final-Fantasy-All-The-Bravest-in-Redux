import {Observable} from 'rx';
import _ from 'lodash';

const MAX_GAUGE = 65536;
const TIME_SLICE = 33;
var source;
var gauge = 0;
var lastTick = 0;

function start(initialGauge = 0)
{
	gauge = initialGauge;
 //    subscription = Rx.Observable.generate(
	// 0,
	// function (x) { return running; }, // condition
	// function (x) { return x + 1; }, // iterate
	// function (x) { return x; }, // result
	// 	Rx.Scheduler.requestAnimationFrame
	// )

	source = Rx.Observable.interval(10, Rx.Scheduler.requestAnimationFrame)
	.timeInterval()
	.select((value, index, observer)=>
	{
		var time = value.interval;
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
				gauge = characterTick(gauge);
				result--;
			}
			// console.log("gauge:", gauge);
			if(gauge > MAX_GAUGE)
			{
				gauge = MAX_GAUGE;
			}
			var percentage = gauge / MAX_GAUGE;
			if(gauge < MAX_GAUGE)
			{
				return {percentage: percentage, gauge: gauge};
			}
			else
			{
				// observer.onCompleted();
				return {percentage: 1, gauge: gauge};
			}
		}
		else
		{
			return {percentage: gauge / MAX_GAUGE, gauge: gauge};
		}
	})
	.takeWhile((o)=>
	{
		return o.percentage !== 1;
	})
	return source;
}

function characterTick(gauge)
{
	var effect = 96;
	var speed = 100;
	var result = (((effect * (speed + 20)) / 16));
	gauge += Math.round(result);
    return gauge;
}

export default {
	start: start
}