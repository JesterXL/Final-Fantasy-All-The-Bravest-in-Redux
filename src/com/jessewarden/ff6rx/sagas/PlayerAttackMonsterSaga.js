import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { BattleUtils } from '../battle/BattleUtils';

function *attack(action)
{
	// let targetHitResult = BattleUtils.getHitAndApplyDamage(
	// 	action.attacker,
	// 	true,
	// 	false,
	// 	)
}