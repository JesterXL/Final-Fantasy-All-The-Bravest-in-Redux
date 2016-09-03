import { 
	PLAYER_ATTACK, 
	PLAYER_HITPOINTS_CHANGED,
	MONSTER_HITPOINTS_CHANGED,
	PLAYER_TURN_OVER,
	STOP_TIMER,
	CHARACTER_DEAD
	 } 
	from '../core/actions';
import { take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga';
import TextDropper from '../views/TextDropper';
import BattleUtils from '../battle/BattleUtils';
import _ from 'lodash';
import {equippedWithGauntlet} from '../battle/Character';

export function *playerAttack(action)
{
	yield call(setPlayerAttackTargets, action.cursorManager, action.stage, action.spriteTargets);
	var targetIndex = yield call(waitForSelectTargetOrCancel, action.cursorManager);
	yield call(clearCursorTargets, action.cursorManager);

	var mySprite = action.playerSprite.sprite.sprite;
	var startWX = mySprite.x;
	var startWY = mySprite.y;
	if(targetIndex === -1)
	{
		yield call(showBattleMenu, action.battleMenu);
	}
	else
	{
		var spriteTargetSelected = action.spriteTargets[targetIndex];
		var target = _.find(action.monsterSpriteMap, ms => ms.sprite.sprite === spriteTargetSelected);
		if(_.isNil(target))
		{
			target = _.find(action.playerSpriteMap, ps => ps.sprite.sprite === spriteTargetSelected);
		}
		if(_.isNil(target))
		{
			throw new Error("Couldn't find target in player or monster sprite maps.");
		}
		var targetX = spriteTargetSelected.x;
		var targetY = spriteTargetSelected.y;
		// welcome kids to lessons in not paying attention in math class
		var dist = Math.sqrt(Math.pow(targetX - startWX, 2) + Math.pow(targetY - startWY, 2));
		var half = dist / 2;
		var halfX = Math.abs(targetX - startWX);
		var halfY = Math.abs(targetY - startWY);
		var middleY = Math.min(startWY, targetY);
		middleY /= 2;
		middleY = -middleY;
		var middleX = halfX;

		yield call(leapTowardsTarget, action.playerSprite.sprite, spriteTargetSelected);
		yield call(firstAttack, action.playerSprite.sprite);
		var targetEntity = _.find(action.monsters, monster => monster.id === target.monsterID);
		if(_.isNil(targetEntity))
		{
			targetEntity = _.find(action.players, player => player.id === target.playerID);
		}
		if(_.isNil(targetEntity))
		{
			throw new Error("Couldn't find targetEntity in player or monster lists.");
		}
		var targetHitResult = yield call(getHitAndApplyDamage, action.player, targetEntity.stamina);
		var textDropper = new TextDropper(action.textDrops);
		if(targetHitResult.hit)
		{
			if(targetEntity.type === 'monster')
			{
				yield put({
					type: MONSTER_HITPOINTS_CHANGED, 
					hitPoints: targetEntity.hitPoints - targetHitResult.damage,
					monster: targetEntity
				});
				console.log("targetEntity:", targetEntity);
				console.log("targetEntity.hitPoints:", targetEntity.hitPoints);
				if(targetEntity.hitPoints <= 0)
				{
					yield put({type: STOP_TIMER});
					yield call(animateMonsterDeath, targetEntity, _.find(action.monsterSpriteMap, ms => ms.monsterID === targetEntity.id).sprite);
					yield put({type: CHARACTER_DEAD, monster: targetEntity});
				}
			}
			else
			{
				yield put({
					type: PLAYER_HITPOINTS_CHANGED, 
					hitPoints: targetEntity.hitPoints - targetHitResult.damage,
					player: targetEntity
				});
			}
			yield call(dropText, textDropper, spriteTargetSelected, targetHitResult.damage);
		}
		else
		{
			yield call(dropText, textDropper, spriteTargetSelected, targetHitResult.damage, 0xFFFFFF, true);
		}
		yield call(leapBackToStartingPosition, action.playerSprite.sprite, startWX, startWY, middleX, middleY);
		yield put({type: PLAYER_TURN_OVER, player: action.player});
	}
}

export function dropText(textDropper, target, damage)
{
	return textDropper.addTextDrop(target, damage);
}

export function getHitAndApplyDamage(player, stamina)
{
	return BattleUtils.getHitAndApplyDamage(player, stamina);
}

export function hideBattleMenu(battleMenu)
{
	return battleMenu.hide();
}

export function setPlayerAttackTargets(cursorManager, stage, spriteTargets)
{
	return cursorManager.setTargets(stage, spriteTargets);
}

export function waitForSelectTargetOrCancel(cursorManager)
{
	return new Promise((success)=>
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

export function clearCursorTargets(cursorManager)
{
	cursorManager.clearAllTargets();
}

export function showBattleMenu(battleMenu)
{
	return battleMenu.show();
}

export function leapTowardsTarget(playerSprite, target)
{
	return playerSprite.leapTowardsTarget(target.x, target.y);
}

export function firstAttack(playerSprite)
{
	return playerSprite.firstAttack();
}

export function leapBackToStartingPosition(playerSprite, targetX, targetY, middleX, middleY)
{
	return playerSprite.leapBackToStartingPosition(targetX, targetY, middleX, middleY);
}

export function animateMonsterDeath(entity, sprite)
{
	return sprite.animateDeath();
}

export function *watchPlayerAttack()
{
	yield takeEvery(PLAYER_ATTACK, playerAttack);
}
