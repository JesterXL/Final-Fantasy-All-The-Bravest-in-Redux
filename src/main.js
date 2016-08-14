import { createStore, applyMiddleware, combineReducers} from 'redux'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './com/jessewarden/ff6redux/reducers/';
import { timer } from './com/jessewarden/ff6redux/sagas/timer';
import { Warrior, Goblin } from './com/jessewarden/ff6redux/enums/entities';
import { ADD_ENTITY, START_TIMER, STOP_TIMER, ADD_COMPONENT } from './com/jessewarden/ff6redux/core/actions';

import {BattleTimerComponent} from './com/jessewarden/ff6redux/components/BattleTimerComponent';


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

export function addWarrior(store, action)
{
	var addEntityAction = addEntity(Warrior, store, ADD_ENTITY);
	addComponent(
		()=>{return BattleTimerComponent(addEntityAction.entity);},
		store,
		ADD_COMPONENT
	);
	addComponent(
		()=>{return }
	)




	console.log("addPlayerSprites");
		var warrior = new Warrior();
		playerSprites.addChild(warrior.sprite);
		warrior.sprite.x = startSpriteX;
		warrior.sprite.y = startSpriteY;
		playerSpriteMap.push({playerID: player.id, sprite: warrior});
		startSpriteY += Warrior.HEIGHT + 20;
		return warrior;
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