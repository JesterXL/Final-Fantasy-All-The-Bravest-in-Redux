import { PLAYER_ATTACK } from '../core/actions';
import { take, put, call, fork} from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'

export function *playerAttack(action)
{
	yield call(hideBattleMenu, action.battleMenu);
	yield call(setPlayerAttackTargets, action.cursorManager, action.spriteTargets);
	var targetIndex = yield call(waitForSelectTargetOrCancel);
	if(targetIndex === -1)
	{
		yield call(showBattleMenu, action.battleMenu);
	}
	else
	{
		var target = actions.monsters[targetIndex];
		var targetHitResult = yield call(getHitAndDamage, action.player, target);
		yield call(playerAttackTarget, 
			targetHitResult, 
			action.spriteTargets, 
			action.spriteTargetsMap, 
			action.player, 
			action.players, 
			action.monsters);
	}
}

export function hideBattleMenu(battleMenu)
{
	return battleMenu.hide();
}

export function setPlayerAttackTargets(cursorManager, spriteTargets)
{
	return cursorManager.setTargets(spriteTargets);
}

export function waitForSelectTargetOrCancel()
{
	return new Promise((success))
	{
		var targetSelectSub = cursorManager.changes.subscribe((event)=>
		{
			switch(event.type)
			{
				case 'cursorManager:escape':
					targetSelectSub.dispose();
					return success(-1);

				case 'cursorManager:selected':
					targetSelectSub.dispose();
					return success(cursorManager.selectedIndex);
			}
		});
	});
}

export function showBattleMenu(battleMenu)
{
	return battleMenu.show();
}

export function getHitAndDamage(attacker, target)
{
	return BattleUtils.getHitAndApplyDamage(attacker, target.stamina);
}

export function playerAttackTarget(
	targetHitResult,
	spriteTargets,
	spriteTargetsMap,
	player,
	players,
	monsters)
{
	// playerAttackTarget, 
	// 		targetHitResult, 
	// 		action.spriteTargets, 
	// 		action.spriteTargetsMap, 
	// 		action.player, 
	// 		action.players, 
	// 		action.monsters);

	if(targetHitResult.hit)
	{
		target.hitPoints = targetHitResult.damage;
		// play player animation
		// when hit(s), drop text on monster
		// complete once character animation done
		// reset character timer
	}
	else
	{
		target.miss();
	}
}

