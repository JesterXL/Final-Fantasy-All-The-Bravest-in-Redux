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
import {startState, noMonster, noPlayer } from './com/jessewarden/ff6redux/reducers/startState';
import {
	ADD_MONSTER, 
	ADD_PLAYER, 
	START_TIMER, 
	PLAYER_TURN, 
	MONSTER_TURN
} from './com/jessewarden/ff6redux/core/actions';

import rootReducer from './com/jessewarden/ff6redux/reducers/';
import { timer } from './com/jessewarden/ff6redux/sagas/timer'; 

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

var renderer, stage;

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
const playerSpriteMap = []; // {playerID: 1, sprite: [Sprite]}
const monsterSpriteMap = []; // {monsterID: 1, spite: [Sprite]}
var battleTimerBars;
var monsterSprites;
var playerSprites;

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

function charactersReady(characters)
{
	return _.filter(characters, p => p.battleState === BattleState.NORMAL);
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

export function Application()
{

	function bootstrap()
	{
		renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
		document.body.appendChild(renderer.view);
		stage = new PIXI.Container();
		stage.interactive = true;
		battleTimerBars = new PIXI.Container();
		stage.addChild(battleTimerBars);
		monsterSprites = new PIXI.Container();
		stage.addChild(monsterSprites);
		playerSprites = new PIXI.Container();
		stage.addChild(playerSprites);

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
		battleMenuFSM.addState('hide',
		['*'],
		()=>
		{
			battleMenu.hide();
		});
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
		battleMenuFSM.initialState = "hide";

		animate();

		const sagaMiddleware = createSagaMiddleware();

		let store = createStore(
			rootReducer,
			applyMiddleware(sagaMiddleware)
		);

		sagaMiddleware.run(timer);

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
					battleMenuFSM.changeState('choose');
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

		delayed(1000, ()=>
		{
			store.dispatch({type: START_TIMER})
		});
	}

	return {
		bootstrap
	}
}

var app = new Application();
app.bootstrap();