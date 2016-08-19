import {expect, assert, should } from 'chai';
should();

import { 
	addEntity, 
	addComponent,
	startTimer,
	stopTimer,
	addWarrior,
	addWarriorEntity,
	addBattleTimerComponent,
	addCharacterComponent,
	addWarriorSprite } from './main';

import { createStore, applyMiddleware, combineReducers} from 'redux'
import { 
	ADD_ENTITY, 
	REMOVE_ENTITY,
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
	describe('#addEntity', ()=>
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
	describe('#addComponent', function()
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
		it('can add mock component', ()=>
		{
			var mockComponentMaker = ()=>{return {entity: mockEntity}};
			addComponent(mockComponentMaker, store, ADD_COMPONENT).should.deep.equal( 
				{type: ADD_COMPONENT, component: mockComponentMaker(mockEntity)}
			);
		});
	});
	describe('#timer', function()
	{
		it("#startTimer", ()=>
		{
			var store = createStore(rootReducer);
			startTimer(store).should.deep.equal(
				{type: START_TIMER}
			);
		});
		it("#stopTimer", ()=>
		{
			var store = createStore(rootReducer);
			stopTimer(store).should.deep.equal( 
				{type: STOP_TIMER}
			);
		});
	});
	describe('#addWarrior', function()
	{
		var store, mockEntity, mockEntityCreator, gen;
		before(()=>
		{
			store = createStore(rootReducer);
			mockEntity = {};
			mockEntityCreator = ()=> { return mockEntity; };
		});
		after(()=>
		{
			store = undefined;
			mockEntity = undefined;
			mockEntityCreator = undefined;
		});
		it('#addWarriorEntity', ()=>
		{
			addWarriorEntity(mockEntityCreator, store).should.deep.equal({
				type: ADD_ENTITY,
				entity: mockEntity
			});
		});
		it('#Character', ()=>
		{
			Character('cow').should.exist;
		});
		it('#addBattleTimerComponent', ()=>
		{
			var battleTimer = BattleTimerComponent(mockEntity);
			addBattleTimerComponent(battleTimer, store).should.deep.equal({
				type: ADD_COMPONENT,
				component: battleTimer
			});
		});
		it("can add a default warrior entity", ()=>
		{
			addWarrior(mockEntityCreator, store);
			var state = store.getState();
			_.includes(state.entities, mockEntity).should.be.true;
		});
	});
	describe('#remove entity', function()
	{
		it('can add and then remove', function()
		{
			var warrior = Warrior();
			var store = createStore(rootReducer);
			store.dispatch({type: ADD_ENTITY, entity: warrior});
			_.includes(store.getState().entities, warrior).should.be.true;
			store.dispatch({type: REMOVE_ENTITY, entity: warrior});
			_.includes(store.getState().entities, warrior).should.be.false;
		});
	});

	// yield addComponent(
	// 	()=>{return BattleTimerComponent(addEntityAction.entity);},
	// 	store,
	// 	ADD_COMPONENT
	// );
	// yield addComponent(
	// 	()=>{return Character(addEntityAction.entity);},
	// 	store,
	// 	ADD_COMPONENT
	// );
	// yield addComponent(
	// 	()=>{return WarriorSprite(addEntityAction.entity);},
	// 	store,
	// 	ADD_COMPONENT
	// );
	
});
