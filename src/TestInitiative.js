import { createStore, applyMiddleware } from 'redux'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import {timer, timerFlow}
				from './com/jessewarden/ff6rx/sagas/GameLoopSaga';
import _ from 'lodash';
import BattleTimerBar from "./com/jessewarden/ff6rx/components/BattleTimerBar";
// import Player from "./com/jessewarden/ff6rx/battle/Player";
import BattleTimer2 from "./com/jessewarden/ff6rx/battle/BattleTimer2";
import Warrior from "./com/jessewarden/ff6rx/sprites/Warrior";

const TICK = 'TICK';
const START_TIMER = 'START_TIMER';
const STOP_TIMER = 'STOP_TIMER';
const ADD_PLAYER = 'ADD_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';

var defaultState = {
	difference: performance.now(),
	running: false,
	players: [],
	monsters: []
};

var playerIDSeed = -1;

function playerReducer(state, action)
{
	switch(action.type)
	{
		case 'ADD_PLAYER':
			// var player = new Player();
			var player = {
				type: 'Warrior',
				generator: BattleTimer2.battleTimer(),
				percentage: 0,
				ready: false,
				id: ++playerIDSeed
			};
			return player;

		case 'TICK':
			var timerResult = state.generator.next(action.difference);
			if(timerResult.value === undefined)
			{
				timerResult = state.generator.next(action.difference);
			}
			return Object.assign({},
				state,
				{
					percentage: timerResult.value.percentage,
					ready: timerResult.value.percentage === 1
				});

		default:
			return state;

	}
}

function differenceReducer(state, action)
{
	if(action.type === TICK)
	{
		return Object.assign({},
			state,
			{
				difference: action.difference
			});
	}
	else
	{
		return state;
	}
}

function reducer(state=defaultState, action)
{
	switch(action.type)
	{
		case TICK:
			state = differenceReducer(state, action);
			state.players = _.map(state.players, (p)=>
			{
				return playerReducer(p, action);
			});
			return state;
		
		case START_TIMER:
			state.running = true;
			return state;

		case STOP_TIMER:
			state.running = false;
			return state;

		case ADD_PLAYER:
			state.players = [
				...state.players,
				playerReducer(undefined, action)
			];
			return state;

		case REMOVE_PLAYER:
			var index = _.findIndex(state.players, t => t.id === action.id);
			state.players = [
				...state.players.slice(0, index),
				...state.players.slice(index + 1)
			];
			return state;

		default:
			return state;
	}
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

function run()
{
	const sagaMiddleware = createSagaMiddleware();

	const store = createStore(
		reducer,
	  applyMiddleware(sagaMiddleware)
	)

	sagaMiddleware.run(timerFlow);

	store.subscribe(() =>
	{
		// console.log("state:", store.getState());
		var state = store.getState();
		mapToBattleTimerBars(state.players);
		mapToSprites(state.players);
	});

	delayed(2000, ()=>
	{
		store.dispatch({type: ADD_PLAYER});
		store.dispatch({type: ADD_PLAYER});
		store.dispatch({type: ADD_PLAYER});
	});

	delayed(3000, ()=>
	{
		store.dispatch({type: START_TIMER})
	});

	delayed(4000, ()=>
	{
		store.dispatch({type: REMOVE_PLAYER, id: 2})
	});

	delayed(5000, ()=>
	{
		store.dispatch({type: STOP_TIMER})
	});

	initializeGUI();
}

var renderer;
var stage;
var startX = 20;
var startY = 20;
var battleTimerBarMap = new Map();
var playerSpriteMap = new Map();

function initializeGUI()
{
	renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();
	stage.interactive = true;
	animate();
}

function createBattleTimerBar(x, y, stage)
{
	var bar = new BattleTimerBar();
	stage.addChild(bar.container);
	bar.container.x = x;
	bar.container.y = y;
	return bar;
}

function createPlayerSprite(x, y, stage)
{
	var sprite = new Warrior();
	stage.addChild(sprite.sprite);
	sprite.sprite.x = x;
	sprite.sprite.y = y;
	return sprite;
}

function mapToBattleTimerBars(players)
{
	if(players && players.length > 0)
	{
		// ghetto loop, not very functional slacker, TODO

		// first, remove ID's that aren't there
		battleTimerBarMap.forEach((bar, id)=>
		{
			var index = _.findIndex(players, o => o.id === id);
			if(index === -1)
			{
				battleTimerBarMap.delete(id);
				stage.removeChild(bar.container);
			}
		});

		// second, create new ones and update all percentages
		var localY = startY;
		_.forEach(players, (p)=>
		{
			// have one already?
			var bar = battleTimerBarMap.get(p.id);
			if(bar === undefined)
			{
				console.log("localY:", localY);
				bar = createBattleTimerBar(startX, localY, stage);
				battleTimerBarMap.set(p.id, bar);
			}
			localY += BattleTimerBar.HEIGHT + 20;
			bar.percentage = p.percentage;
			bar.render();
		});
	}
}

function mapToSprites(players)
{
	if(players && players.length > 0)
	{
		// first, remove ID's that aren't there
		playerSpriteMap.forEach((sprite, id)=>
		{
			var index = _.findIndex(players, o => o.id === id);
			if(index === -1)
			{
				playerSpriteMap.delete(id);
				stage.removeChild(sprite.sprite);
			}
		});

		// second, create new ones and update all percentages
		var localY = startY;
		_.forEach(players, (p)=>
		{
			// have one already?
			var sprite = playerSpriteMap.get(p.id);
			if(sprite === undefined)
			{
				console.log("localY:", localY);
				sprite = createPlayerSprite(startX + 100, localY, stage);
				playerSpriteMap.set(p.id, sprite);
			}
			localY += Warrior.HEIGHT + 20;
		});
	}
}

function animate()
{
	requestAnimationFrame(()=>
	{
		animate();
	});
	renderer.render(stage);
}

run();