const log = console.log;
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger';
import { entities, ADD_ENTITY, REMOVE_ENTITY } from './com/jessewarden/ff6/entities';
import { timers, CREATE_TIMER, START_TIMER, STOP_TIMER } from './com/jessewarden/ff6/timers';
import { characters, CREATE_CHARACTER, DESTROY_CHARACTER, CHARACTER_HIT_POINTS_CHANGED } from './com/jessewarden/ff6/characters';
import {
	battleTimers,
	CREATE_BATTLE_TIMER,
	START_BATTLE_TIMER,
	UPDATE_BATTLE_TIMER,
	RESET_AND_START_BATTLE_TIMER
} from './com/jessewarden/ff6/battletimers';
import { menustate } from './com/jessewarden/ff6/menustate';
import { currentCharacter, SET_CHARACTER_TURN, CHARACTER_TURN_OVER, NO_CHARACTER } from './com/jessewarden/ff6/currentcharacter';
import { playerState, PLAYER_READY} from './com/jessewarden/ff6/playerstate';
import * as playerStateModule from './com/jessewarden/ff6/playerstate';
import * as ff6 from 'final-fantasy-6-algorithms';
const {guid} = ff6.core;
import * as _ from 'lodash';
import BattleTimerBar from './com/jessewarden/ff6/views/BattleTimerBar';
import PlayerList from './com/jessewarden/ff6/views/PlayerList';
import "gsap";
import TextDropper from './com/jessewarden/ff6/views/TextDropper';
import Menu from './com/jessewarden/ff6/views/Menu';
import BattleMenu from './com/jessewarden/ff6/views/BattleMenu';
import "howler"; 
import CharacterSprite from './com/jessewarden/ff6/views/CharacterSprite';
import { getHit, getDamage, getHitDefaultGetHitOptions } from './com/jessewarden/ff6/battle/BattleUtils';
import { items, REMOVE_ITEM } from './com/jessewarden/ff6/items'
import { selectedItem, SELECT_ITEM } from './com/jessewarden/ff6/selecteditem'

let store, unsubscribe, pixiApp, charactersContainer, blankMenu;
let keyboardManager, cursorManager;
export const setupRedux = ()=>
{
	const allReducers = combineReducers({
		entities,
		timers,
		characters,
		battleTimers,
		menustate,
		currentCharacter,
		playerState,
		items,
		selectedItem
	});
	// store = createStore(allReducers, applyMiddleware(logger));
	store = createStore(allReducers);
	pixiApp = setupPixi();
	store.dispatch({type: 'cow'});
	
	PIXI.loader.add('./src/fonts/Final_Fantasy_VI_SNESa.eot');
	PIXI.loader.add('./src/fonts/Final_Fantasy_VI_SNESa.ttf');
	PIXI.loader.add('./src/fonts/Final_Fantasy_VI_SNESa.woff');
	PIXI.loader.add('./src/fonts/Final_Fantasy_VI_SNESa.svg');
	PIXI.loader.load((loader, resources) =>
	{
	// 	keyboardManager = new KeyboardManager();
	// 	cursorManager = new CursorManager(keyboardManager);
	// 	pixiApp.stage.addChild(cursorManager);

	// 	const battleMenu = new BattleMenu(keyboardManager, cursorManager);
	// 	battleMenu.show();

		addPlayerAndBattleTimer('Cow');
		const secondPlayerAction = addPlayerAndBattleTimer('JesterXL');
		addMonsterAndBattleTimer();
		const playerList = new PlayerList(store);
		pixiApp.stage.addChild(playerList);
		// log("pixiApp.screen:", pixiApp.screen);
		playerList.x = pixiApp.renderer.width - playerList.width;
		playerList.y = pixiApp.renderer.height - playerList.height;; 

		// blankMenu = new Menu(undefined, pixiApp.screen.width - playerList._width - 4, playerList._height);
		// pixiApp.stage.addChild(blankMenu);
		// blankMenu.y = pixiApp.screen.height - blankMenu.height;

		const state = store.getState();
		_.chain(state.battleTimers)
		.map(battleTimer => battleTimer.entity)
		.forEach(battleTimerEntity =>
		{
			startBattleTimer(battleTimerEntity, window, 
			doneEvent =>
			{
				store.dispatch({type: UPDATE_BATTLE_TIMER, entity: doneEvent.entity, event: doneEvent});
				log("characterEntity done:", doneEvent.characterEntity);
				const character = _.find(store.getState().characters, character => character.entity === doneEvent.characterEntity);
				if(character.characterType === 'player' && store.getState().currentCharacter === NO_CHARACTER)
				{
					store.dispatch({type: SET_CHARACTER_TURN, entity: doneEvent.characterEntity});
					store.dispatch({type: PLAYER_READY, entity: doneEvent.characterEntity});
				}
			},
			progressEvent =>
			{
				store.dispatch({type: UPDATE_BATTLE_TIMER, entity: progressEvent.entity, event: progressEvent});
			});
		})
		.value();

		showHitPointsLowered(secondPlayerAction.playerEntity);

		let currentKnownState = playerStateModule.WAITING;
		let battleMenu, itemsMenu;
		const stateSub = store.subscribe(()=>
		{
			const state = store.getState();
			if(state.playerState === currentKnownState)
			{
				return;
			}

			if(battleMenu)
			{
				battleMenu.visible = false;
			}
			if(itemsMenu)
			{
				itemsMenu.visible = false;
			}
			
			switch(currentKnownState)
			{
				case playerStateModule.CHOOSE:
					// battleMenu.parent.removeChild(battleMenu);
					// battleMenu = undefined;
					break;

				case playerStateModule.WAITING:
					
					break;

				default:
					break;
			}

			currentKnownState = state.playerState;
			
			switch(state.playerState)
			{
				case playerStateModule.CHOOSE:
					if(!battleMenu)
					{
						battleMenu = new BattleMenu(store);
						pixiApp.stage.addChild(battleMenu);
						battleMenu.changes.subscribe(event =>
						{
							// log("BattleMenu::event:", event);
							switch(event.menuItem.name)
							{
								case 'Attack':
									// log("clicked attack");
									store.dispatch({type: playerStateModule.CHANGE_PLAYER_STATE, state: playerStateModule.ATTACK_CHOOSE_TARGET});
									return;

								case 'Items':
									store.dispatch({type: playerStateModule.CHANGE_PLAYER_STATE, state: playerStateModule.ITEMS});
									store.dispatch({type: playerStateModule.CHANGE_PLAYER_STATE, state: playerStateModule.ITEMS});
									return;

								default:
									return;
							}
						});
					}
					battleMenu.y = 200;
					battleMenu.visible = true;
					battleMenu.interactiveChildren = true;
					break;
				
				case playerStateModule.ATTACK_CHOOSE_TARGET:
					battleMenu.visible = false;
					battleMenu.interactiveChildren = false;
					break;
				
				case playerStateModule.ITEMS:
					const itemsToShow = _.map(store.getState().items, item => Object.assign({}, item, {
						name: item.itemType
					}));
					if(!itemsMenu)
					{
						
						itemsMenu = new Menu(itemsToShow, 300, 200);
						pixiApp.stage.addChild(itemsMenu);
						itemsMenu.changes.subscribe(event =>
						{
							store.dispatch({
								type: SELECT_ITEM,
								item: event.menuItem.entity
							});
							store.dispatch({
								type: playerStateModule.CHANGE_PLAYER_STATE, 
								state: playerStateModule.CHOOSE_ITEM_TARGET
							});
						});
					}
					itemsMenu.x = 300;
					itemsMenu.y = 200;
					itemsMenu.visible = true;
					itemsMenu.interactiveChildren = true;
					itemsMenu.alpha = 1;
					itemsMenu.setMenuItems(itemsToShow);
					break;
				
				case playerStateModule.CHOOSE_ITEM_TARGET:
					itemsMenu.alpha = 0.5;
					itemsMenu.interactiveChildren = false;

				case playerStateModule.WAITING:
				default:
					break;
			}
		});

	});

	log(store.getState());
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

export const addPlayer = (id, name)=>
{
	return store.dispatch({
		type: CREATE_CHARACTER, 
		entity: id, 
		characterType: 'player',
		name
	});
};

export const removePlayer = (id)=>
{
	return store.dispatch({type: DESTROY_CHARACTER, entity: id});
};

export const addPlayerAndBattleTimer = (name)=>
{
	const playerID = guid();
	store.dispatch({type: ADD_ENTITY, entity: playerID});
	const playerEvent = addPlayer(playerID, name);
	const battleTimerID = guid();
	const battleTimerEvent = addBattleTimer(battleTimerID, playerID);
	return {
		playerEntity: playerID,
		playerEvent,
		battleTimerEntity: battleTimerID,
		battleTimerEvent
	};
};

export const addMonster = (id)=>
{
	return store.dispatch({type: CREATE_CHARACTER, entity: id, characterType: 'monster'});
};

export const addMonsterAndBattleTimer = ()=>
{
	const monsterID = guid();
	store.dispatch({type: ADD_ENTITY, entity: monsterID});
	const monsterEvent = addMonster(monsterID);
	const battleTimerID = guid();
	const battleTimerEvent = addBattleTimer(battleTimerID, monsterID);
	return {
		monsterEntity: monsterID,
		monsterEvent,
		battleTimerEntity: battleTimerID,
		battleTimerEvent
	};
};

let textDropper;
export const setupPixi = ()=>
{
	// const app = new PIXI.Application(768,  762);
	// const app = new PIXI.Application(512, 448);
	const ratio = _.defaultTo(window.devicePixelRatio, 1);
	const app = new PIXI.Application(750, 1334, {
		antialias: true,
		resolution: ratio
	});
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

let playerStartX = 200;
let playerStartY = 20;
let monsterStartX = 20;
let monsterStartY = 20;

export const getSpriteFromCharacter = character =>
{
	let sprite;
	const basePath = './src/com/jessewarden/ff6/characters';
	if(character.characterType === 'player')
	{
		sprite = new CharacterSprite('./src/images/locke.png', character.entity, true, store, playerStartX, playerStartY);
		playerStartX += 20;
		playerStartY += 60;
	}
	else if(character.characterType === 'monster')
	{
		sprite = new CharacterSprite('./src/images/goblin.png', character.entity, false, store, monsterStartX, monsterStartY);
		monsterStartX += 10;
		monsterStartY += 40;
	}
	else
	{
		throw new Error("Unknown character type");
	}
	sprite.entity = character.entity;
	sprite.changes.subscribe(event =>
	{
		log("Sprite clicked as attack target, event:", event);
		const state = store.getState();
		switch(state.playerState)
		{
			case playerStateModule.ATTACK_CHOOSE_TARGET:
				attackTarget(event.entity, event.sprite)
				.then(result=>
				{
					log("attack target complete, result:", result);
					
				})
				.catch(error =>
				{
					log("attack target error:", error);
				});
				return;
			
			case playerStateModule.CHOOSE_ITEM_TARGET:
				applyItemToTarget(event.entity, event.sprite)
				.then(result=>
				{
					log("applyItemToTarget complete, result:", result);
					
				})
				.catch(error =>
				{
					log("applyItemToTarget error:", error);
				});
				return;
		}
		
	});
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

export const attackTarget = async (targetEntity, targetSprite)=>
{
	const state = store.getState();
	log(state);
	const playerEntity = state.currentCharacter;
	const playerSprite = _.find(charactersContainer.children, sprite => sprite.entity === playerEntity);
	const playerCharacter = _.find(state.characters, character => character.entity === playerEntity);
	const targetCharacter = _.find(state.characters, character => character.entity === targetEntity);
	log("targetEntity:", targetEntity);
	log("targetSprite:", targetSprite);
	log("playerEntity:", playerEntity);
	log("playerSprite:", playerSprite);
	log("playerCharacter:", playerCharacter);
	log("targetCharacter:", targetCharacter);
	const startPlayerX = playerSprite.x;
	const startPlayerY = playerSprite.y;
	await playerSprite.leapTowardsTarget(targetSprite.x, targetSprite.y);
	const hitOptions = getHitDefaultGetHitOptions();
	const hitResult = getHit(hitOptions);
	if(hitResult.hit === false)
	{
		textDropper.addTextDrop(targetSprite, 0, 0xFFFFFF, true);
	}
	else
	{
		const damageResult = getDamage();
		textDropper.addTextDrop(targetSprite, damageResult.value);
	}
	await playerSprite.leapBackToStartingPosition(startPlayerX, startPlayerY, startPlayerX + 10, startPlayerY + 10);
	endCurrentPlayerTurn(store);
	resetPlayersBattleTimer(store);
	setNextReadyPlayerToCurrent(store);
};

export const applyItemToTarget = async (targetEntity, targetSprite)=>
{
	log("   ");
	log("********");
	log("   ");
	log("applyItemToTarget");
	const state = store.getState();
	log("state:", state);

	const selectedItem = state.selectedItem;
	const item = _.find(state.items, item => item.entity === selectedItem);
	log("item:", item);
	store.dispatch({type: REMOVE_ITEM, item: selectedItem});
	switch(item.itemType)
	{
		case 'Potion':
			textDropper.addTextDrop(targetSprite, 250, 0x00FF00);
			break;

		default:
			return;
	}

	endCurrentPlayerTurn(store);
	resetPlayersBattleTimer(store);
	setNextReadyPlayerToCurrent(store);
};

const endCurrentPlayerTurn = store =>
{
	const state = store.getState();
	const playerEntity = state.currentCharacter;
	return store.dispatch({type: playerStateModule.CHANGE_PLAYER_STATE, state: playerStateModule.WAITING});
};

const resetPlayersBattleTimer = store =>
{
	const state = store.getState();
	const playerEntity = state.currentCharacter;
	const battleTimers = state.battleTimers;
	const playerBattleTimer = _.find(battleTimers, battleTimer => battleTimer.characterEntity === playerEntity);
	return store.dispatch({type: RESET_AND_START_BATTLE_TIMER, entity: playerBattleTimer.entity});
};

const setNextReadyPlayerToCurrent = store =>
{
	// see if any players are waiting
	const state = store.getState();
	const playerEntity = state.currentCharacter;
	const characters = state.characters;
	const battleTimers = state.battleTimers;
	const readyPlayers = _.chain(battleTimers)
	.filter(battleTimer => battleTimer.characterEntity !== playerEntity)
	.filter(battleTimer => battleTimer.complete)
	.reduce((acc, battleTimer) =>
	{
		const character = _.find(characters, character => character.entity === battleTimer.characterEntity);
		if(character)
		{
			acc.push(character);
		}
		return acc;
	}, [])
	.filter(character => character.characterType === 'player')
	.value();
	if(readyPlayers.length > 0)
	{
		if(state.currentCharacter === playerEntity)
		{
			store.dispatch({type: CHARACTER_TURN_OVER, entity: playerEntity});
			const nextReadyPlayer = _.first(readyPlayers);
			store.dispatch({type: SET_CHARACTER_TURN, entity: nextReadyPlayer.entity});
			store.dispatch({type: PLAYER_READY, entity: nextReadyPlayer.entity});
		}
		
	}	
};