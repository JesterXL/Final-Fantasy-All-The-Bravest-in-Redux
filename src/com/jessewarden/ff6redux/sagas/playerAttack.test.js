import {expect, assert, should } from 'chai';
should();

import { take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga';

import { playerAttack } from './playerAttack';
import { getCharacter, makePlayer, makeMonster } from '../battle/Character';
import { genericEntity } from '../enums/entities';

describe('#playerAttack', ()=>
{
	describe('playerAttack', ()=>
	{
		var entity = genericEntity();
		var mockPlayer = makePlayer(entity);
		var mockMonster = makeMonster(entity);
		var mockStore = {
			getState: ()=> {
				return {
					entities: [entity],
					components: [mockPlayer, mockMonster]
				}
			}
		};

		var gen = playerAttack();
	})
});