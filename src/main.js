import { createStore, applyMiddleware, combineReducers} from 'redux'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './com/jessewarden/ff6redux/reducers/';
import { timer } from './com/jessewarden/ff6redux/sagas/timer';
import { Warrior, Goblin } from './com/jessewarden/ff6redux/enums/entities';
import { ADD_ENTITY, START_TIMER, STOP_TIMER, ADD_COMPONENT } from './com/jessewarden/ff6redux/core/actions';

import {BattleTimerComponent} from './com/jessewarden/ff6redux/components/BattleTimerComponent';
import {Character} from './com/jessewarden/ff6redux/battle/Character';
import WarriorSprite from './com/jessewarden/ff6redux/sprites/warrior/WarriorSprite';


var sagaMiddleware;
var store;
var unsubscribe;


export function setupRedux()
{
	sagaMiddleware = createSagaMiddleware();
	store = createStore(
			rootReducer,
			applyMiddleware(sagaMiddleware)
	);

	sagaMiddleware.run(rootSaga);

	unsubscribe = store.subscribe(()=>
	{
		var state = store.getState()

	});

	var firstWarrior  = addEntity(Warrior, store, ADD_ENTITY);
	var secondWarrior = addEntity(Warrior, store, ADD_ENTITY);
	var thirdWarrior  = addEntity(Warrior, store, ADD_ENTITY);
	
	var firstGoblin   = addEntity(Goblin, store, ADD_ENTITY);
	var secondGoblin  = addEntity(Goblin, store, ADD_ENTITY);
	var thirdGoblin   = addEntity(Goblin, store, ADD_ENTITY);
	
	addComponent(()   => BattleTimerComponent(firstWarrior), store, ADD_COMPONENT);
}

export function addEntity(entityCreator, store, action)
{
	var entity = entityCreator();
	return store.dispatch({type: action, entity: entity});
}

export function addComponent(componentCreator, store, action)
{
	var component = componentCreator();
	return store.dispatch({type: action, component: component});
}

export function startTimer(store)
{
	return store.dispatch( { type: START_TIMER } );
}

export function stopTimer(store)
{
	return store.dispatch( { type: STOP_TIMER });
}

export function *addWarrior(warriorCreator, store)
{
	var addEntityAction = yield addEntity(warriorCreator, store, ADD_ENTITY);
	yield addComponent(
		()=>{return BattleTimerComponent(addEntityAction.entity);},
		store,
		ADD_COMPONENT
	);
	yield addComponent(
		()=>{return Character(addEntityAction.entity);},
		store,
		ADD_COMPONENT
	);
	yield addComponent(
		()=>{return WarriorSprite(addEntityAction.entity);},
		store,
		ADD_COMPONENT
	);
}

function *rootSaga()
{
	yield [
		timer()
		// watchPlayerTurn(),
		// watchPlayerAttack()
	];
}

// export function updateMonsterSprites(monsters)
// {
// 	var monstersToRemove = getMonstersToRemove(monsterSpriteMap, monsters);
// 	if(monstersToRemove.length > 0)
// 	{
// 		startMonsterSpriteY = removeMonsterSprites(monstersToRemove, monsterSpriteMap, startMonsterSpriteY);
// 	}
// 	var monstersToAdd = getMonsterSpritesToAdd(monsterSpriteMap, monsters);
// 	if(monstersToAdd.length > 0)
// 	{
// 		startMonsterSpriteY = addMonsterSprites(monstersToAdd, monsterSprites, monsterSpriteMap, startMonsterSpriteX, startMonsterSpriteY);
// 	}
// }

export function getMonstersToRemove(monsterSpriteMap, monsters)
{
	return _.differenceWith(
		monsterSpriteMap,
		monsters,
		(psObject, monster)=> psObject.monsterID === monster.id);
}