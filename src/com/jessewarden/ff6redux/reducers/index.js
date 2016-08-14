import gameLoop from './gameLoop';
import monsters from './monsters';
import monsterWhoseTurnItIs from './monsterWhoseTurnItIs';
import players from './players';
import playerWhoseTurnItIs from './playerWhoseTurnItIs';
import entities from './entities';
import components from './components';

import {combineReducers} from 'redux'

let rootReducer = combineReducers({
	gameLoop,
	players,
	monsters,
	playerWhoseTurnItIs,
	monsterWhoseTurnItIs,
	entities,
	components
});

export default rootReducer