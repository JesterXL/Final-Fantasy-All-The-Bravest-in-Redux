import {expect, assert, should } from 'chai';
should();

import { ADD_ENTITY, REMOVE_ENTITY, CHARACTER_DEAD} from '../core/actions';
import { entities } from './entities';

describe('#entities', ()=>
{
	it('basic test', ()=>
	{
		expect(entities).to.exist;
	});
	describe('#entities', ()=>
	{
		it('ADD adds it', ()=>
		{
			var entity = 'moo';
			entities([], {type: ADD_ENTITY, entity}).should.have.lengthOf(1);
		});
		it('entity is there', ()=>
		{
			var entity = 'moo';
			entities([], {type: ADD_ENTITY, entity}).should.include(entity);
		});
		it('REMOVE removes it', ()=>
		{
			var entity = 'moo';
			entities([entity], {type: REMOVE_ENTITY, entity}).should.have.lengthOf(0);
		});
		it('CHARACTER_DEAD removes entity', ()=>
		{
			var entity = 'moo';
			var character = {entity};
			entities([entity], {type: CHARACTER_DEAD, character}).should.have.lengthOf(0);
		});
	});
	
	
});