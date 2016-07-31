import 'babel-polyfill';

import BattleTimer from "./com/jessewarden/ff6redux/battle/BattleTimer";
import BattleTimer2 from "./com/jessewarden/ff6redux/battle/BattleTimer2";
import TextDropper from './com/jessewarden/ff6redux/components/TextDropper';
import BattleTimerBar from "./com/jessewarden/ff6redux/components/BattleTimerBar";
import BattleMenu from "./com/jessewarden/ff6redux/components/BattleMenu";
import StateMachine from './com/jessewarden/ff6redux/core/StateMachine';
import PIXI from 'pixi.js';
import {Subject} from 'rx';
import _ from "lodash";
import Row from "./com/jessewarden/ff6redux/enums/Row";
import Relic from "./com/jessewarden/ff6redux/items/Relic";
import Player from './com/jessewarden/ff6redux/battle/Player';
import Monster from './com/jessewarden/ff6redux/battle/Monster';
import BattleState from './com/jessewarden/ff6redux/enums/BattleState';
import Warrior from './com/jessewarden/ff6redux/sprites/warrior/Warrior';
import Goblin from './com/jessewarden/ff6redux/sprites/goblin/Goblin';
import CursorManager from './com/jessewarden/ff6redux/managers/CursorManager';
import KeyboardManager from './com/jessewarden/ff6redux/managers/KeyboardManager';

import { createStore, applyMiddleware, combineReducers} from 'redux'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
// import './com/jessewarden/ff6redux/sagas/TestSagas';
// import './TestBattleTimers';
// import './TestBattleTimerBars';
// import './TestInitiative';
// import './TestMovieClip';
// import './TestCursorManager';
// import './TestMenu';


export function Application()
{
	var renderer, stage;

	const TICK        = 'TICK';
	const START_TIMER = 'START_TIMER';
	const STOP_TIMER  = 'STOP_TIMER';
	
	const ADD_PLAYER  = 'ADD_PLAYER';
	const ADD_MONSTER = 'ADD_MONSTER';	

	const PLAYER_TURN = 'PLAYER_TURN';
	const MONSTER_TURN = 'MONSTER_TURN';

	var startBarX = 200;
	var startBarY = 200;
	var startSpriteX = 200;
	var startSpriteY = 20;
	var startMonsterSpriteX = 20;
	var startMonsterSpriteY = 20;
	var battleMenu = undefined;
	var battleMenuFSM = undefined;
	var keyboardManager;
	var cursorManager; 

	function bootstrap()
	{
		// this.canvasTag = document.getElementById('#stage');
		renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
		document.body.appendChild(renderer.view);
		stage = new PIXI.Container();
		stage.interactive = true;
		const battleTimerBars = new PIXI.Container();
		stage.addChild(battleTimerBars);
		const monsterSprites = new PIXI.Container();
		stage.addChild(monsterSprites);
		const playerSprites = new PIXI.Container();
		stage.addChild(playerSprites);

		const playerSpriteMap = []; // {playerID: 1, sprite: [Sprite]}
		const noPlayer = {};
		const noMonster = {};
		const monsterSpriteMap = []; // {monsterID: 1, spite: [Sprite]}

		animate();

		var startState = {
			gameLoop: {
				now: performance.now(),
				running: false
			},
			players: [],
			monsters: [],
			playerWhoseTurnItIs: noPlayer,
			monsterWhoseTurnItIs: noMonster
		};

		function players(state=[], action)
		{
			switch(action.type)
			{
				case ADD_PLAYER:
					return [...state, action.player];
				
				case TICK:
					return _.map(state, (player)=>
					{
						var timerResult = player.generator.next(action.difference);
						if(timerResult.done)
						{
							return player;
						}

						if(timerResult.value === undefined)
						{
							timerResult = player.generator.next(action.difference);
						}
						if(timerResult.value.percentage === 1)
						{
							return Object.assign({}, player,
							{
								percentage: 1,
								battleState: BattleState.NORMAL
							});
						}
						return Object.assign({}, player,
						{
							percentage: timerResult.value.percentage
						});
					});

				default:
					return state;
			}
		}

		function monsters(state=[], action)
		{
			switch(action.type)
			{
				case ADD_MONSTER:
					return [...state, action.monster];

				case TICK:
					return _.map(state, (monster)=>
					{
						var timerResult = monster.generator.next(action.difference);
						if(timerResult.done)
						{
							return monster;
						}

						if(timerResult.value === undefined)
						{
							timerResult = monster.generator.next(action.difference);
						}
						return Object.assign({}, monster,
						{
							percentage: timerResult.value.percentage
						});
					});
				default:
					return state;
			}
		}

		function gameLoop(state=startState.gameLoop, action)
		{
			switch(action.type)
			{
				case TICK:
					return Object.assign({}, state, {now: action.now});
				
				case START_TIMER:
					return Object.assign({}, state, {running: true});
					return state;

				case STOP_TIMER:
					return Object.assign({}, state, {running: false});

				default:
					return state;
			}
		}

		function playerWhoseTurnItIs(state, action)
		{
			switch(action.type)
			{
				case PLAYER_TURN:
					return Object.assign({}, state, action.player);

				default:
					if(_.isUndefined(state))
					{
						return noPlayer;
					}
					return state;
			}
		}

		function monsterWhoseTurnItIs(state, action)
		{
			switch(action.type)
			{
				case MONSTER_TURN:
					return Object.assign({}, state, action.monster);

				default:
					if(_.isUndefined(state))
					{
						return noMonster;
					}
					return state;
			}
		}

		function *ticker(action)
		{
			var lastTick = performance.now();
			while(true)
			{
				yield call(delay, 1000);
				var now = performance.now();
				var difference = now - lastTick;
				lastTick = now;
				yield put({type: TICK, now: now, difference: difference});
			}
		}

		function *timer()
		{
			while(yield take(START_TIMER))
			{
				const task = yield fork(ticker);
				yield take(STOP_TIMER);
				yield cancel(task);
			}
		}

		// function *mySaga()
		// {
		// 	console.log("mySaga");
		// 	yield* takeEvery('START_TIMER', timer);
		// }

		// LET THE MUTABLE STATE BEGIN... MORRRTAALLL KOOOMMBAAATTT! #mutablekombat
		function updateMonsterSprites(monsters)
		{
			var monstersToRemove = getMonstersToRemove(monsterSpriteMap, monsters);
			if(monstersToRemove.length > 0)
			{
				removeMonsterSprites(monstersToRemove, monsterSpriteMap, startMonsterSpriteY);
			}
			var monstersToAdd = getMonsterSpritesToAdd(monsterSprites, monsters);
			if(monstersToAdd.length > 0)
			{
				addMonsterSprites(monstersToAdd, monsterSprites, monsterSpriteMap, startMonsterSpriteX, startMonsterSpriteY);
			}
		}

		function getMonstersToRemove(monsterSpriteMap, monsters)
		{
			return _.differenceWith(
				monsterSpriteMap,
				monsters,
				(psObject, monster)=> psObject.monsterID === monster.id);
		}

		function removeMonsterSprites(monsterSpritesToRemove, monsterSpriteMap, startMonsterSpriteY)
		{
			return _.forEach(monsterSpritesToRemove, (sprite)=>
			{
				sprite.parent.removeChild(sprite.sprite);
				_.remove(monsterSpriteMap, o => o.sprite === o);
				startMonsterSpriteY -= 60;
			});
		}

		function getMonsterSpritesToAdd(monsterSpriteMap, monsters)
		{
			return _.differenceWith(
				monsters,
				monsterSpriteMap,
				(monster, psObject)=> psObject.monsterID === monster.id);
		}

		function addMonsterSprites(monstersToAdd, monsterSprites, monsterSpriteMap, startMonsterSpriteX, startMonsterSpriteY)
		{
			_.forEach(monstersToAdd, (monster)=>
			{
				var goblin = new Goblin();
				monsterSprites.addChild(goblin.sprite);
				goblin.sprite.x = startMonsterSpriteX;
				goblin.sprite.y = startMonsterSpriteY;
				monsterSpriteMap.push({monsterID: monster.id, sprite: goblin});
				startMonsterSpriteY += 60;
				return goblin;
			});
		}

		function updatePlayerSprites(players)
		{
			var playersToRemove = getPlayersSpritesToRemove(playerSpriteMap, players);
			if(playersToRemove.length > 0)
			{
				removePlayerSprites(playersToRemove, playerSpriteMap, startSpriteY);
			}
			var playersToAdd = getPlayerSpritesToAdd(playerSprites, players);
			if(playersToAdd.length > 0)
			{
				addPlayerSprites(playersToAdd, playerSprites, playerSpriteMap, startSpriteY);
			}
			renderPlayerUpdates(players, playerSpriteMap);
			// console.log("playersToRemove:", playersToRemove);
			// console.log("playersToAdd:", playersToAdd);
		}

		function getPlayersSpritesToRemove(playerSpriteMap, players)
		{
			return _.differenceWith(
				playerSpriteMap, 
				players, 
				(psObject, player) => psObject.playerID === player.id);
		}

		function removePlayerSprites(playerSpritesToRemove, playerSpriteMap, startSpriteY)
		{
			return _.forEach(playerSpritesToRemove, (sprite) => 
			{
				sprite.parent.removeChild(sprite.sprite);
				_.remove(playerSpriteMap, o => o.sprite === sprite);
				startSpriteY -= Warrior.HEIGHT + 20;
			});
		}

		function getPlayerSpritesToAdd(playerSpriteMap, players)
		{
			console.log("getPlayerSpritesToAdd");
			console.log("playerSpriteMap:", playerSpriteMap);
			console.log("players:", players);
			return _.differenceWith(
				players, 
				playerSpriteMap, 
				(player, psObject)=> {
					console.log("psObject.playerID:", psObject.playerID);
					console.log("player.id:", player.id);
					return psObject.playerID === player.id;

				});
		}

		function addPlayerSprites(playersToAdd, playerSprites, playerSpriteMap, startSpriteY)
		{
			_.forEach(playersToAdd, (player)=>
			{
				console.log("addPlayerSprites");
				var warrior = new Warrior();
				playerSprites.addChild(warrior.sprite);
				warrior.sprite.x = startSpriteX;
				warrior.sprite.y = startSpriteY;
				playerSpriteMap.push({playerID: player.id, sprite: warrior});
				startSpriteY += Warrior.HEIGHT + 20;
				return warrior;
			});
		}

		function renderPlayerUpdates(players, playerSpriteMap)
		{
			_.forEach(playerSpriteMap, (psObject)=>
			{
				var player = _.find(players, o => o.id === psObject.playerID);
				// console.log("psObject.sprite.percentage:", psObject.sprite.percentage);
				psObject.sprite.setPercentage(player.percentage);
				psObject.sprite.stand();
				// switch(player.battleState)
				// {
				// 	case BattleState.NORMAL:
				// 		psObject.sprite.stand();
				// 		break;

				// 	case BattleState.WAITING:
				// 		psObject.sprite.stand();
				// 		break;

				// 	case BattleState.DEFENDING:
				// 		psObject.sprite.stand();
				// 		break;

				// 	// case BattleState.ANIMATING:
				// 	// case BattleState.RUNNING:
				// }
			});
		}

		const sagaMiddleware = createSagaMiddleware();

		let reducers = combineReducers({
			gameLoop,
			players,
			monsters,
			playerWhoseTurnItIs,
			monsterWhoseTurnItIs
		})
		let store = createStore(
			reducers,
			applyMiddleware(sagaMiddleware)
		);

		sagaMiddleware.run(timer);

		function charactersReady(characters)
		{
			return _.filter(characters, p => p.battleState === BattleState.NORMAL);
		}

		function showBattleMenu()
		{
			keyboardManager = new KeyboardManager();
			cursorManager = new CursorManager(stage, keyboardManager);

			battleMenu = new BattleMenu(stage);
			battleMenu.changes.subscribe((event)=>
			{
				switch(event.item)
				{
					case "Attack":
						battleMenuFSM.changeState('attackTarget');
						break;
				}
			});
			
			battleMenuFSM = new StateMachine();
			battleMenuFSM.addState("choose",
			['*'],
			()=>{
				battleMenu.show();
			});
			battleMenuFSM.addState("attackTarget",
			['*'],
			()=>{
				battleMenu.hide();
				cursorManager.setTargets(store.getState().monsters)
			});
			battleMenuFSM.addState("items",
			['*'],
			()=>{});
			battleMenuFSM.initialState = "choose";
		}

		store.subscribe(() =>
		{
			var state = store.getState();
			updateMonsterSprites(state.monsters);
			updatePlayerSprites(state.players);
			// console.log("state.playerWhoseTurnItIs:", state.playerWhoseTurnItIs);
			if(state.playerWhoseTurnItIs === noPlayer)
			{
				var playersReadyToGo = charactersReady(state.players);
				if(playersReadyToGo.length > 0)
				{
					var playerTurn = _.head(playersReadyToGo);
					store.dispatch({type: PLAYER_TURN, player: playerTurn});
					showBattleMenu();
				}
			}

			if(state.monsterWhoseTurnItIs === noMonster)
			{
				var monstersReadyToGo = charactersReady(state.monsters);
				if(monstersReadyToGo.length > 0)
				{
					store.dispatch({type: MONSTER_TURN, monster: _.head(monstersReadyToGo)});
				}	
			}
		});

		store.dispatch({ type: ADD_MONSTER, monster: new Monster() });
		store.dispatch({ type: ADD_MONSTER, monster: new Monster() });

		store.dispatch({ type: ADD_PLAYER, player: new Player() });
		store.dispatch({ type: ADD_PLAYER, player: new Player() });
		store.dispatch({ type: ADD_PLAYER, player: new Player() });

		store.dispatch({ type: ADD_MONSTER, monster: new Monster()});

		var times = _.map(store.getState().players, p => p.percentage);
		// console.log("before times:", times);
		delayed(1000, ()=>
		{
			store.dispatch({type: START_TIMER})
		});

		// delayed(2000, ()=>
		// {
		// 	store.dispatch({type: STOP_TIMER})
		// 	times = _.map(store.getState().players, p => p.percentage);
		// // console.log("after times:", times);
		// });
	}
	
	function animate()
	{
		requestAnimationFrame(()=>
		{
			animate();
		});
		renderer.render(stage);
	}

	function delayed(milliseconds, callback)
	{
		return new Promise((success, failure)=>
		{
			setTimeout(()=>
			{
				callback();
				success();
			}, milliseconds);
		});
	}

	return {
		bootstrap
	}
}

var app = new Application();
app.bootstrap();