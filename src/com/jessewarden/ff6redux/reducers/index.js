import gameLoop from './gameLoop';
import monsterWhoseTurnItIs from './monsterWhoseTurnItIs';
import playerWhoseTurnItIs from './playerWhoseTurnItIs';
import { entities } from './entities';
import { components } from './components';

import {combineReducers} from 'redux'

let rootReducer = combineReducers({
	gameLoop,
	playerWhoseTurnItIs,
	monsterWhoseTurnItIs,
	entities,
	components
});

export default rootReducer