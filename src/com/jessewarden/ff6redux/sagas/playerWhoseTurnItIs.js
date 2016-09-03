import { PLAYER_TURN, PLAYER_TURN_READY } from '../core/actions';
import { take, put, call, fork} from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga';
import _ from 'lodash';
import {PLAYER_ATTACK} from '../core/actions';
import BattleMenu from '../views/BattleMenu';

export function *playerTurn(action)
{
	const menuResult = yield call(
		showBattleMenu, 
		action.stage, 
		action.battleMenusContainer, 
		action.keyboardMangager, 
		action.cursorManager
	);
	switch(menuResult)
	{
		case "Attack":
			yield put({
				type: PLAYER_ATTACK,
				player: action.player
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
			// switch(event.item)
			// {
				// case "Attack":
					// console.log("playerSprites.children:", playerSprites.children);
					// console.log("monsterSprites.children:", monsterSprites.children);
					// var state = store.getState();
					// store.dispatch({
					// 	type: PLAYER_ATTACK,
					// 	stage,
					// 	textDrops,
					// 	players: state.players,
					// 	monsters: state.monsters,
					// 	playerSpriteMap,
					// 	monsterSpriteMap,
					// 	cursorManager,
					// 	battleMenu,
					// 	player: _.find(state.players, p => p.id === state.playerWhoseTurnItIs),
					// 	playerSprite: _.find(playerSpriteMap, psm => psm.playerID === state.playerWhoseTurnItIs),
					// 	spriteTargets: playerSprites.children.concat(monsterSprites.children),
					// });
					
					// store.dispatch({
					// 	type: PLAYER_ATTACK
					// });
					// break;
			// }
		});
		battleMenu.show();
	});
}

export function *watchPlayerTurn()
{
	yield takeEvery(PLAYER_TURN, playerTurn);
}
