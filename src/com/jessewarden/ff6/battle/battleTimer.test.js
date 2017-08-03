// import {expect, assert, should } from 'chai';
// should();
// const log = console.log;

// import {
// 	getPercentage,
// 	MAX_GAUGE,
// 	characterTick,
// 	EFFECT_NORMAL,
// 	Timer,
// 	BattleTimer,
// 	MODE_PLAYER
	
// } from './battleTimer';

// const wait = (milliseconds)=>
// {
// 	return new Promise((success)=>
// 	{
// 		setTimeout(()=>
// 		{
// 			success();
// 		}, milliseconds);
// 	});
// }; 

// describe('#battleTimer', ()=>
// {
// 	describe("#getPercentage", ()=>
// 	{
// 		it('gives 50 for 100', ()=>
// 		{
// 			const half = MAX_GAUGE / 2;
// 			getPercentage(half).should.equal(0.5);
// 		});
// 	});
// 	describe("#characterTick", ()=>
// 	{
// 		it('by default gives you 120', ()=>
// 		{
// 			characterTick(EFFECT_NORMAL, 0, 0).should.equal(120);
// 		});
// 		it('twice gives you 240', ()=>
// 		{
// 			let result = characterTick(EFFECT_NORMAL, 0, 0);
// 			result += characterTick(EFFECT_NORMAL, 0, 0);
// 			result.should.equal(240);
// 		});
// 	});
// 	// describe("#timerBrowserNotNode", ()=>
// 	// {
// 	// 	let gen;
// 	// 	beforeEach(()=>
// 	// 	{
// 	// 		gen = timerBrowserNotNode();
// 	// 	});
// 	// 	it('should give time', ()=>
// 	// 	{
// 	// 		gen.next().value.time.should.exist;
// 	// 	});
// 	// 	it('should give difference', ()=>
// 	// 	{
// 	// 		gen.next().value.difference.should.exist;
// 	// 	});
// 	// 	it('should give 100 milliseconds if you wait 100 milliseconds for 2nd call',  async ()=>
// 	// 	{
// 	// 		const result1 = gen.next();
// 	// 		await wait(100);
// 	// 		const result2 = gen.next();
// 	// 		result2.value.difference.should.be.within(50, 150);
// 	// 	});
// 	// 	it('time passed between 100 milliseconds should be around 100 milliseconds', async ()=>
// 	// 	{
// 	// 		const result1 = gen.next();
// 	// 		await wait(100);
// 	// 		const result2 = gen.next();
// 	// 		(result2.value.time - result1.value.time).should.be.within(50, 150);
// 	// 	});
// 	// });
// 	describe("#Timer", ()=>
// 	{
// 		let timer;
// 		beforeEach(()=>
// 		{
// 			timer = new Timer();
// 		});
// 		afterEach(()=>
// 		{
// 			timer.stopTimer();
// 		});
// 		it('not running by default', ()=>
// 		{
// 			timer.running.should.equal(false);
// 		});
// 		it('running when you start it', ()=>
// 		{
// 			timer.startTimer(window);
// 			timer.running.should.equal(true);
// 		});
// 		it('running is false when you start and stop it', ()=>
// 		{
// 			timer.startTimer(window);
// 			timer.stopTimer();
// 			timer.running.should.equal(false);
// 		});
// 		it("should work for 100 milliseconds", (done)=>
// 		{
// 			let total = 0;
// 			timer.startTimer(window, (time, difference, now, previousTick)=>
// 			{
// 				// log("**********");
// 				// log("time:", time);
// 				// log("difference:", difference);
// 				// log("now:", now);
// 				// log("previousTick:", previousTick);
// 				total += difference;
// 				if(total >= 100)
// 				{
// 					timer.stopTimer();
// 					done();
// 				}
// 			});
// 		});
// 	});
// 	describe("#BattleTimer", function()
// 	{
// 		this.timeout(20 * 1000);

// 		let battleTimer;
// 		beforeEach(()=>
// 		{
// 			battleTimer = new BattleTimer();
// 		});
// 		afterEach(()=>
// 		{
// 			battleTimer.stopTimer();
// 		});
// 		it('should give you a progress', (done)=>
// 		{
// 			battleTimer.startTimer(window, ()=>{}, ()=> done());
// 		});
// 		it('goes to 100 percent eventually', (done)=>
// 		{
// 			const fastTimer = new BattleTimer(0, 0, EFFECT_NORMAL, MODE_PLAYER, 255);
// 			fastTimer.startTimer(window, ()=> done());
// 		});
// 	});
// });