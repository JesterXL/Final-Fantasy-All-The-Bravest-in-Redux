import {Subject} from "rx";

function create()
{
	var source = Rx.Observable.interval(0, Rx.Scheduler.requestAnimationFrame)
	.map(() =>
	{
		return {
			time: performance.now(),
			delta: 0
		};
	})
	.scan((previous, current)=>
	{
		return {
			time: current.time,
			delta: current.time - previous.time
		};
	});
	return source;
}

module.exports = {
	create: create
};