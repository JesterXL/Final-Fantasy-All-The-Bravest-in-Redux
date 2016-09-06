import { PLAYER_TURN, PLAYER_TURN_READY } from '../core/actions';
import { take, put, call, fork} from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga';
import _ from 'lodash';
import {PLAYER_ATTACK} from '../core/actions';
import BattleMenu from '../views/BattleMenu';
import {
	getStage,
	getBattleMenusContainer,
	getKeyboardManager,
	getCursorManager
} from '../core/locators';

export function *playerTurn(action)
{
	const state = action.store.getState();
	const stage = getStage(state.components);
	const battleMenusContainer = getBattleMenusContainer(state.components);
	const keyboardMangager = getKeyboardManager(state.components);
	const cursorManager = getCursorManager(state.components);
	const menuResult = yield call(
		showBattleMenu, 
		stage, 
		battleMenusContainer, 
		keyboardMangager, 
		cursorManager
	);
	switch(menuResult)
	{
		case "Attack":
			yield put({
				type: PLAYER_ATTACK,
				player: action.player,
				store: action.store
			});
			break;
	}
	yield put({type: PLAYER_TURN_READY, player: action.player});
}

export function showBattleMenu(stage, battleMenusContainer, keyboardMangager, cursorManager)
{
	return new Promise((success)=>
	{
		var battleMenu = new BattleMenu();
		battleMenu.setup(stage, battleMenusContainer, keyboardMangager, cursorManager);
		battleMenu.changes.subscribe((event)=>
		{
			battleMenu.tearDown();
			battleMenu = undefined;
			success(event.item);
		});
		battleMenu.show();
	});
}

export function *watchPlayerTurn()
{
	yield takeEvery(PLAYER_TURN, playerTurn);
}
