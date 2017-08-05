// import 'babel-polyfill';

// import {setupRedux} from './main';

// export function Application()
// {
// 	setupRedux();
// }

// Application();

require("babel-core/register");
require("babel-polyfill");

const log = console.log;
import PIXI from 'pixi.js';
// import * as ff6 from 'final-fantasy-6-algorithms';
// const {
//     BattleTimer,
//     MODE_PLAYER,
//     EFFECT_NORMAL
//  } = ff6.battle.battleTimer;
//  const {guid} = ff6.core;
// const timer = new BattleTimer(window, performance, 0, 0, EFFECT_NORMAL, MODE_PLAYER, 255);
// const delay = milliseconds => new Promise((success)=>
// {
//     setTimeout(()=> success(), milliseconds);
// });

// timer.startTimer((percentage, gauge)=>
// {
//     log("Done!");
// },
// (percentage, gauge)=>
// {
//     log("percentage:", percentage);
// });
// delay(500)
// .then(()=>
// {
//     timer.stopTimer();
//     return delay(1000);
// })
// .then(()=>
// {
//     log("timer:", timer);
//     timer.resume();
// });

import { setupRedux } from './application';
setupRedux();