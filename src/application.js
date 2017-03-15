const log = console.log;
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger';
import { entities, ADD_ENTITY, REMOVE_ENTITY } from './com/jessewarden/ff6redux/entities';
import * as ff6 from 'final-fantasy-6-algorithms';
const {guid} = ff6.core;

let store, unsubscribe;
export const setupRedux = ()=>
{
	store = createStore(entities, applyMiddleware(createLogger()));
    unsubscribe = store.subscribe(()=>
	{
		var state = store.getState();
        log("store subscribe, state:", state);
	});
    store.dispatch({type: ADD_ENTITY, entity: guid()})
};