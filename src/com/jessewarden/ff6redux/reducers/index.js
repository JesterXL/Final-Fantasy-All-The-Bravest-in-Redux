import gameLoop from './gameLoop';
import monsters from './monsters';
import monsterWhoseTurnItIs from './monsterWhoseTurnItIs';
import players from './players';
import playerWhoseTurnItIs from './playerWhoseTurnItIs';

import {combineReducers} from 'redux'

let rootReducer = combineReducers({
	gameLoop,
	players,
	monsters,
	playerWhoseTurnItIs,
	monsterWhoseTurnItIs
});

export default rootReducer