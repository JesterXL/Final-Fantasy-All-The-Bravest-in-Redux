import { PLAYER_TURN, PLAYER_TURN_READY } from '../core/actions';
import { take, put, call, fork} from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga';

export function *playerTurn(action)
{
	yield call(showBattleMenu, action.battleMenu);
	yield put({type: PLAYER_TURN_READY, player: action.player});
}

export function showBattleMenu(battleMenu)
{
	return battleMenu.show();
}

export function *watchPlayerTurn()
{
	yield takeEvery(PLAYER_TURN, playerTurn);
}