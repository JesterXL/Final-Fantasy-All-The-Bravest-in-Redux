import {expect, assert, should } from 'chai';


import { 
	addEntity, 
	addComponent,
	startTimer,
	stopTimer,
	addWarrior } from './main';
import { createStore, applyMiddleware, combineReducers} from 'redux'
import { 
	ADD_ENTITY, 
	ADD_COMPONENT,
	START_TIMER,
	STOP_TIMER } from './com/jessewarden/ff6redux/core/actions';
import rootReducer from './com/jessewarden/ff6redux/reducers/';
import _ from 'lodash';

import { Warrior, Goblin } from './com/jessewarden/ff6redux/enums/entities';

import {BattleTimerComponent} from './com/jessewarden/ff6redux/components/BattleTimerComponent';
import {Character} from './com/jessewarden/ff6redux/battle/Character';
import WarriorSprite from './com/jessewarden/ff6redux/sprites/warrior/WarriorSprite';

describe('#main', function()
{
	it('basic test', function()
	{
		expect(true).to.equal(true);
	});
	describe('#addEntity', (t)=>
	{
		var store, mockEntity;

		before(()=>
		{
			store = createStore(rootReducer);
			mockEntity = 'testentity';
		});
		after(()=>
		{
			store = undefined;
			mockEntity = undefined;
		});
		it('store does not include entity by default', function()
		{
			expect(_.includes(store.getState().entities, mockEntity)).to.not.equal(true);
		});
		it('addEntity has legit action', function()
		{
			expect(addEntity(()=>{return mockEntity}, store, ADD_ENTITY)).to.deep.equal({type: ADD_ENTITY, entity: mockEntity});
		});
		it('includes mockEntity after you add it', function()
		{	
			expect(_.includes(store.getState().entities, mockEntity)).to.equal(true);
		});
	});
	// test('#main::addComponent', (t)=>
	// {
	// 	t.plan(1);
	// 	var store = createStore(rootReducer);
	// 	var mockEntity = 'testentity';
	// 	var mockComponentMaker = ()=>{return {entity: mockEntity}};
	// 	t.deepEqual(
	// 		addComponent(mockComponentMaker, store, ADD_COMPONENT), 
	// 		{type: ADD_COMPONENT, component: mockComponentMaker(mockEntity)}
	// 	);
	// });
	// test("#main::startTimer", (t)=>
	// {
	// 	var store = createStore(rootReducer);
	// 	t.plan(1);
	// 	t.deepEqual(
	// 		startTimer(store), 
	// 		{type: START_TIMER}
	// 	);
	// });
	// test("#main::stopTimer", (t)=>
	// {
	// 	var store = createStore(rootReducer);
	// 	t.plan(1);
	// 	t.deepEqual(
	// 		stopTimer(store), 
	// 		{type: ADD_ENTITY}
	// 	);
	// });
});



// test("#main::*addWarrior", (t)=>
// {
// 	var store = createStore(rootReducer);
// 	t.plan(1);
// 	var mockEntity = Warrior();
// 	var gen = addWarrior(Warrior, store);
// 	t.deepEqual(
// 		gen.next().value, 
// 		{type: ADD_ENTITY, entity: mockEntity}
// 	);
// });