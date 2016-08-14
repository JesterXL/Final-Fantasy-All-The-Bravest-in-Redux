import test from 'tape';
import { 
	addEntity, 
	addComponent,
	startTimer,
	stopTimer } from './main';
import { createStore, applyMiddleware, combineReducers} from 'redux'
import { 
	ADD_ENTITY, 
	ADD_COMPONENT,
	START_TIMER,
	STOP_TIMER } from './com/jessewarden/ff6redux/core/actions';
import rootReducer from './com/jessewarden/ff6redux/reducers/';
import _ from 'lodash';

test('timing test', (t)=>
{
	t.plan(1);
    t.ok(true, true);
});
test('#main::addEntity', (t)=>
{
	t.plan(3);
	var store = createStore(rootReducer);
	var mockEntity = 'testentity';
	t.notOk(_.includes(store.getState().entities, mockEntity));
	t.deepEqual(
		addEntity(()=>{return mockEntity}, store, ADD_ENTITY), 
		{type: ADD_ENTITY, entity: mockEntity}
	);
	t.ok(_.includes(store.getState().entities, mockEntity));
});
test('#main::addComponent', (t)=>
{
	t.plan(1);
	var store = createStore(rootReducer);
	var mockEntity = 'testentity';
	var mockComponentMaker = ()=>{return {entity: mockEntity}};
	t.deepEqual(
		addComponent(mockComponentMaker, store, ADD_COMPONENT), 
		{type: ADD_COMPONENT, component: mockComponentMaker(mockEntity)}
	);
});
test("#main::startTimer", (t)=>
{
	var store = createStore(rootReducer);
	t.plan(1);
	t.deepEqual(
		startTimer(store), 
		{type: START_TIMER}
	);
});
test("#main::stopTimer", (t)=>
{
	var store = createStore(rootReducer);
	t.plan(1);
	t.deepEqual(
		stopTimer(store), 
		{type: STOP_TIMER}
	);
});