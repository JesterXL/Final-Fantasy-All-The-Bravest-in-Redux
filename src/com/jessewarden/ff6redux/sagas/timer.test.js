// import {expect, assert, should } from 'chai';
// should();
// const log = console.log;

// import {START_TIMER, STOP_TIMER, TICK} from '../core/actions';
// import { take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
// import { takeEvery, takeLatest, delay } from 'redux-saga'

// import {
// 	timer,
//     ticker
// } from './timer';

// describe('#timer saga', ()=>
// {
// 	it('timer works with start', ()=>
// 	{
// 		timer().next().value.should.deep.equal(take(START_TIMER));
// 	});
// });
// describe('#ticker', ()=>
// {
//     it('gives initial time', ()=>
//     {
//         const gen = ticker();
//         const result1 = gen.next();
//         const result2 = gen.next();
//         log("result2:", result2.value.CALL.args);
//     });
// });
// // t.deepEqual(
// //     generator.next().value,
// //     call(delay, 1000),
// //     'counter Saga must call delay(1000)'
// //   )

// //   t.deepEqual(
// //     generator.next().value,
// //     put({type: 'INCREMENT'}),
// //     'counter Saga must dispatch an INCREMENT action'
// //   )

// //   t.deepEqual(
// //     generator.next(),
// //     { done: true, value: undefined },
// //     'counter Saga must be done'
// //   )
