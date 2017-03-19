const log = console.log;
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createLogger from 'redux-logger';
import { entities, ADD_ENTITY, REMOVE_ENTITY } from './com/jessewarden/ff6/entities';
import { timers, CREATE_TIMER, START_TIMER, STOP_TIMER } from './com/jessewarden/ff6/timers';
import { characters, CREATE_CHARACTER, DESTROY_CHARACTER, CHARACTER_HIT_POINTS_CHANGED } from './com/jessewarden/ff6/characters';
import {
	battleTimers,
	CREATE_BATTLE_TIMER,
	START_BATTLE_TIMER,
	UPDATE_BATTLE_TIMER
} from './com/jessewarden/ff6/battletimers';
import * as ff6 from 'final-fantasy-6-algorithms';
const {guid} = ff6.core;
import * as _ from 'lodash';
import BattleTimerBar from './com/jessewarden/ff6/views/BattleTimerBar';
import PlayerList from './com/jessewarden/ff6/views/PlayerList';
import "gsap";
import TextDropper from './com/jessewarden/ff6/views/TextDropper';


let store, unsubscribe, pixiApp, charactersContainer;
export const setupRedux = ()=>
{
	const allReducers = combineReducers({
		entities,
		timers,
		characters,
		battleTimers
	});
	store = createStore(allReducers, applyMiddleware(createLogger()));
	// store = createStore(allReducers);
	pixiApp = setupPixi();
	//setupAndStartGameTimer();
	// const newPlayerID = addPlayer();
	// addMonster();
	// setTimeout(()=>
	// {
	// 	removePlayer(newPlayerID);
	// }, 2000);

	// addBattleTimers();

	addPlayerAndBattleTimer();
	const secondPlayerAction = addPlayerAndBattleTimer();

	const playerList = new PlayerList(store);
	pixiApp.stage.addChild(playerList);
	playerList.x = pixiApp.screen.width - playerList.width;
	playerList.y = 200; 

	const state = store.getState();
	_.chain(state.battleTimers)
	.map(battleTimer => battleTimer.entity)
	.forEach(battleTimerEntity =>
	{
		startBattleTimer(battleTimerEntity, window, 
		doneEvent =>
		{
			store.dispatch({type: UPDATE_BATTLE_TIMER, entity: doneEvent.entity});
		},
		progressEvent =>
		{
			store.dispatch({type: UPDATE_BATTLE_TIMER, entity: progressEvent.entity});
		});
	})
	.value();

	showHitPointsLowered(secondPlayerAction.playerEntity);
};

export const setupAndStartGameTimer = ()=>
{
	const timerID = makeTimer();
	const tick = (time, difference, now, previousTick) =>
	{
		// log("time: " + time + ", diff: " + difference + ", now: " + now + ", prev: " + previousTick);
		// log(time / 1000);
		if(time >= 3000)
		{
			stopTimer(timerID);
		}	
	};
	startTimer(timerID, window, tick);
	return timerID;
};

export const makeTimer = ()=>
{
	const id = guid();
	store.dispatch({type: ADD_ENTITY, entity: id});
	store.dispatch({type: CREATE_TIMER, entity: id});
	return id;
};

export const startTimer = (entity, window, callback) =>
{
	return store.dispatch({type: START_TIMER, entity, window, callback});
};

export const stopTimer = entity =>
{
	return store.dispatch({type: STOP_TIMER, entity});
};

export const addPlayer = (id)=>
{
	return store.dispatch({type: CREATE_CHARACTER, entity: id, characterType: 'player'});
};

export const removePlayer = (id)=>
{
	return store.dispatch({type: DESTROY_CHARACTER, entity: id});
};

export const addPlayerAndBattleTimer = ()=>
{
	const playerID = guid();
	const playerEvent = addPlayer(playerID);
	const battleTimerID = guid();
	const battleTimerEvent = addBattleTimer(battleTimerID, playerID);
	return {
		playerEntity: playerID,
		playerEvent,
		battleTimerEntity: battleTimerID,
		battleTimerEvent
	};
};

export const addMonster = ()=>
{
	const id = guid();
	store.dispatch({type: CREATE_CHARACTER, entity: id, characterType: 'monster'});
	return id;
};

let textDropper;
export const setupPixi = ()=>
{
	const app = new PIXI.Application();
	document.body.appendChild(app.view);

	charactersContainer = new PIXI.Container();
	app.stage.addChild(charactersContainer);

	textDropper = new TextDropper();
	app.stage.addChild(textDropper);

	const unsubscribe = store.subscribe(()=>
	{
		const state = store.getState();
		const spritesToRemove = getSpritesToRemove(charactersContainer.children, state.characters);
		// log("spritesToRemove:", spritesToRemove);
		if(spritesToRemove.length > 0)
		{
			removeSprites(spritesToRemove);
		}

		const charactersToAdd = getCharactersToAdd(state.characters, charactersContainer.children);
		// log("charactersToAdd:", charactersToAdd);
		if(charactersToAdd.length > 0)
		{
			addCharacters(charactersToAdd, charactersContainer);
		}
	});
	return app;
};

export const getCharactersToAdd = (characters, children) =>
{
	return _.differenceWith(characters, children, (character, sprite) =>
	{
		return character.entity === sprite.entity;
	});
};

export const getSpritesToRemove = (children, characters)=>
{
	return _.differenceWith(children, characters, (sprite, character) =>
	{
		return sprite.entity === character.entity;
	});
};

let playerStartX = 400;
let playerStartY = 20;
let monsterStartX = 20;
let monsterStartY = 20;
export const getSpriteFromCharacter = character =>
{
	let sprite;
	const basePath = './src/com/jessewarden/ff6/characters';
	if(character.characterType === 'player')
	{
		sprite = new PIXI.Sprite.fromImage(basePath + '/warrior_stand.png');
		sprite.x = playerStartX;
		sprite.y = playerStartY;
		playerStartX += 20;
		playerStartY += 80;
	}
	else if(character.characterType === 'monster')
	{
		sprite = new PIXI.Sprite.fromImage(basePath + '/goblin.png');
		sprite.x = monsterStartX;
		sprite.y = monsterStartY;
		monsterStartX += 20;
		monsterStartY += 80;
	}
	else
	{
		throw new Error("Unknown character type");
	}
	sprite.entity = character.entity;
	return sprite;
};

export const addCharacters = (characters, parent) =>
{
	return _.chain(characters)
	.map(getSpriteFromCharacter)
	.forEach(sprite => parent.addChild(sprite))
	.value();
};

export const removeSprites = sprites =>
{
	return _.forEach(sprites, sprite => sprite.parent.removeChild(sprite));
};


export const addBattleTimers = ()=>
{
	const test = new BattleTimerBar();
	pixiApp.stage.addChild(test);
	test.x = 300;
	test.y = 300;
	

	const addedID = addBattleTimer();
	startBattleTimer(addedID, window, (battleTimerEvent)=>
	{
		const p = Math.round(percentage * 100);
		log(p + "%, gauge: " + gauge);
		log("Done.");
		test.percentage = percentage;
		test.render();
	},
	(battleTimerEvent)=>
	{
		const p = Math.round(percentage * 100);
		log(p + "%, gauge: " + gauge);
		test.percentage = percentage;
		test.render();
	});
};

export const addBattleTimer = (id, characterID)=>
{
	return store.dispatch({type: CREATE_BATTLE_TIMER, entity: id, characterEntity: characterID, speed: 255});
};

export const startBattleTimer = (entity, window, doneCallback, progressCallback) =>
{
	return store.dispatch({
		type: START_BATTLE_TIMER,
		entity,
		window,
		doneCallback,
		progressCallback
	});
};

export const delay = milliseconds =>
{
	return new Promise( success => setTimeout(success, milliseconds) );
};

export const showHitPointsLowered = (playerEntity)=>
{
	return delay(3 * 1000)
	.then(()=>
	{
		const characterSprite = _.find(charactersContainer.children, sprite => sprite.entity === playerEntity);
		textDropper.addTextDrop(characterSprite, 2);
		return Promise.resolve(store.dispatch({type: CHARACTER_HIT_POINTS_CHANGED, newHitPoints: 8, entity: playerEntity}));
	});
};