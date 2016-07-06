import {Observable} from 'rx';
import _ from 'lodash';

const MAX_GAUGE = 65536;
const TIME_SLICE = 33;
var source;
var gauge = 0;
var running = true;
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

	source = Rx.Observable.interval(100)
	.timeInterval()
	.select((value, index, observer)=>
	{
		try
		{
			// console.log("value:", value);
			// console.log("index:", index);
			var time = value.interval;
			lastTick += Math.round(time);
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
				var percentage = gauge / MAX_GAUGE;
				console.log("percentage:", percentage);
				if(percentage == null)
				{
					throw new Error("This can't be null home slice dice mice thrice lice kites... kites doesn't rhyme.");
				}
				if(gauge < MAX_GAUGE)
				{
					return percentage;
				}
				else
				{
					console.log("observer:", observer);
					// observer.onCompleted();
					return 1;
				}
			}
		}
		catch(err)
		{
			console.error("err:", err);
		}
	});
	return source;
}

function stop()
{
	running = false;
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
	start: start,
	stop: stop
}