import { 
	PLAYER_ATTACK, 
	CHARACTER_HITPOINTS_CHANGED,
	PLAYER_TURN_OVER,
	STOP_TIMER,
	CHARACTER_DEAD,
	START_TIMER
	 } 
	from '../core/actions';
import { take, put, call, fork, cancel, cancelled, select } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga';
import TextDropper from '../views/TextDropper';
import { getHitAndApplyDamage } from '../battle/BattleUtils';
import _ from 'lodash';
import {equippedWithGauntlet} from '../battle/Character';
import { 
	getFirstReadyCharacter,
	getSpriteComponentsFromComponents,
	reduceSpriteComponentsToSprites,
	getComponentSpriteFromEntity,
	getCharacterFromSprite,
	getComponentSpriteFromSprite,
	getCursorManager,
	getKeyboardManager,
	getStage,
	getStageComponent,
	getAliveSpriteTargets,
	getCharacterFromEntity
} from '../core/selectors';

export function *playerAttack(action)
{
	try
	{
		const spriteTargets = yield select(getAliveSpriteTargets);
		// console.log("spriteTargets:", spriteTargets);
		// yield put({type: STOP_TIMER});
		const cursorManager   = yield select(getCursorManager);
		const stage           = yield select(getStage);
		const keyboardManager = yield select(getKeyboardManager);
		yield call(setupCursorManager, cursorManager, stage, keyboardManager);
		yield call(setPlayerAttackTargets, cursorManager, stage, spriteTargets);
		var targetIndex = yield call(waitForSelectTargetOrCancel, cursorManager);
		yield call(clearCursorTargets, cursorManager);
		yield call(cursorManagerTearDown, cursorManager);

		if(targetIndex === -1)
		{
			yield call(showBattleMenu, action.battleMenu);
		}
		else
		{
			const playerSprite = yield select(getComponentSpriteFromEntity, action.player.entity);
			var mySprite = playerSprite.sprite;
			var startWX = mySprite.x;
			var startWY = mySprite.y;
			var spriteTargetSelected = spriteTargets[targetIndex];
			var targetCharacter = yield select(getCharacterFromSprite, spriteTargetSelected);
			// console.log("targetCharacter:", targetCharacter);
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

			yield call(leapTowardsTarget, playerSprite, spriteTargetSelected);
			console.log("calling firstAttack");
			yield call(firstAttack, playerSprite);
			console.log("calling getHitAndApplyDamage");
			var targetHitResult = yield call(getHitAndApplyDamage, action.player, targetCharacter.stamina);
			console.log("targetHitResult:", targetHitResult);
			const textDropper = new TextDropper(stage);
			console.log("textDropper:", textDropper);
			// console.log("targetHitResult.hit:", targetHitResult.hit);
			if(targetHitResult.hit === true)
			{
				console.log("if on targetCharacter.characterType:", targetCharacter);
				if(targetCharacter.characterType === 'monster')
				{
					console.log("putting character hitPoints changed for monster");
					console.log("after targetCharacter.hitPoints:", targetCharacter.hitPoints);
					yield put({
						type: CHARACTER_HITPOINTS_CHANGED, 
						hitPoints: targetCharacter.hitPoints - targetHitResult.damage,
						character: targetCharacter
					});
					console.log("targetCharacter.entity:", targetCharacter.entity);

					const updatedTargetCharacter = yield select(getCharacterFromEntity, targetCharacter.entity);
					console.log("updatedTargetCharacter.hitPoints:", updatedTargetCharacter.hitPoints);
					if(updatedTargetCharacter.hitPoints <= 0)
					{
						// yield put({type: STOP_TIMER});
						console.log("spriteTargetSelected:", spriteTargetSelected);
						const monsterComponentSprite = yield select(getComponentSpriteFromSprite, spriteTargetSelected);
						yield call(animateMonsterDeath, monsterComponentSprite);
						console.log("CHARACTER_DEAD, updatedTargetCharacter:", updatedTargetCharacter);
						yield put({type: CHARACTER_DEAD, character: updatedTargetCharacter});
					}
				}
				else
				{
					console.log("putting character hitPoints changed for player");
					yield put({
						type: CHARACTER_HITPOINTS_CHANGED, 
						hitPoints: targetCharacter.hitPoints - targetHitResult.damage,
						character: targetCharacter
					});
				}
				console.log("calling dropText for hit");
				yield call(dropText, textDropper, spriteTargetSelected, targetHitResult.damage);
			}
			else
			{
				console.log("calling dropText for miss");
				yield call(dropText, textDropper, spriteTargetSelected, targetHitResult.damage, 0xFFFFFF, true);
			}
			console.log("calling leapBackToStartingPosition");
			yield call(leapBackToStartingPosition, playerSprite, startWX, startWY, middleX, middleY);
			yield put({type: PLAYER_TURN_OVER, character: action.player});
			// yield put({type: START_TIMER});
		}

	}
	catch(err)
	{
		console.log("playerAttack saga error:", err);
	}
}

export function dropText(textDropper, target, damage)
{
	return textDropper.addTextDrop(target, damage);
}

export function hideBattleMenu(battleMenu)
{
	return battleMenu.hide();
}

export function setupCursorManager(cursorManager, stage, keyboardManager)
{
	cursorManager.setup(stage, keyboardManager);
}

export function setPlayerAttackTargets(cursorManager, stage, spriteTargets)
{
	console.log("cursorManager:", cursorManager);
	console.log("stage:", stage);
	console.log("spriteTargets:", spriteTargets);
	return cursorManager.setTargets(stage, spriteTargets);
}

export function waitForSelectTargetOrCancel(cursorManager)
{
	return new Promise((success)=>
	{
		console.log("cursorManager:", cursorManager);
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

export function cursorManagerTearDown(cursorManager)
{
	cursorManager.tearDown();
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

export function animateMonsterDeath(sprite)
{
	// return sprite.animateDeath();
	sprite.animateDeath();
}

export function *watchPlayerAttack()
{
	yield takeEvery(PLAYER_ATTACK, playerAttack);
}
