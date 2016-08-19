import {expect, assert, should } from 'chai';
should();
import _ from 'lodash';
import PIXI from 'pixi.js';

import {
	componentsToRemove,
	entitiesToCreateComponentsFor,
	getSpriteComponentsFromComponents,
	removeComponentsSpritesFromParent,
	filterPlayerComponents,
	filterMonsterComponents,
	positionComponents,
	addComponentSpritesToParent,
	addPlayerSprites
	 } from './SpriteSystem';

import { createStore, applyMiddleware, combineReducers} from 'redux'

describe('#SpriteSystem', ()=>
{
	describe('#componentsToRemove', ()=>
	{
		it('shows a list for difference', ()=>
		{
			componentsToRemove([
					{name: 'Comp1', entity: 'a'},
					{name: 'Comp2', entity: 'a'},
					{name: 'Comp3', entity: 'b'}
				],
				['a']
			)[0].should.deep.equal({name: 'Comp3', entity: 'b'});
		});
		it('empty list for no diffs', ()=>
		{
			componentsToRemove([
					{name: 'Comp1', entity: 'a'},
					{name: 'Comp2', entity: 'a'},
					{name: 'Comp3', entity: 'b'}
				],
				[
					'a',
					'b'
				]
			).should.be.empty;
		});
		it('no matches equal all', ()=>
		{
			componentsToRemove([
					{name: 'Comp1', entity: 'a'},
					{name: 'Comp2', entity: 'a'},
					{name: 'Comp3', entity: 'b'}
				],
				['c']
			).should.have.lengthOf(3);
		});
	});
	describe('#entitiesToCreateComponentsFor', ()=>
	{
		it('shows 1 item as diff', ()=>
		{
			entitiesToCreateComponentsFor([
					{name: 'Comp1', entity: 'a'},
					{name: 'Comp2', entity: 'b'}
				],
				['a', 'b', 'c']
			)[0].should.equal('c');
		});
		it('shows 1 even if alone', ()=>
		{
			entitiesToCreateComponentsFor([
					{name: 'Comp1', entity: 'a'},
					{name: 'Comp2', entity: 'b'}
				],
				['c']
			)[0].should.equal('c');
		});
		it('shows even if no components', ()=>
		{
			entitiesToCreateComponentsFor([],['c']
			)[0].should.equal('c');
		});
	});
	describe('#getSpriteComponentsFromComponents', ()=>
	{
		it('empty with no matches', ()=>
		{
			getSpriteComponentsFromComponents([
				{name: 'moo'},
				{yo: 'man'}
			]).should.be.empty;
		});
		it('empty empty', ()=>
		{
			getSpriteComponentsFromComponents([]).should.be.empty;
		});
		it('1 with 1 match', ()=>
		{
			getSpriteComponentsFromComponents([
				{type: 'moo'},
				{type: 'componentSprite', name: 'cheese'}
			])[0].should.deep.equal({type: 'componentSprite', name: 'cheese'});
		});
		it('2 with 4 items and 2 matches', ()=>
		{
			getSpriteComponentsFromComponents([
				{type: 'moo'},
				{type: 'moo'},
				{type: 'uno', name: 'cheese'},
				{type: 'componentSprite', name: 'cheese'},
				{type: 'componentSprite', name: 'cheese'}
			]).should.have.lengthOf(2);
		});
	});
	describe('#removeComponentsSpritesFromParent', ()=>
	{
		it('can pass nothing', ()=>
		{
			removeComponentsSpritesFromParent.should.not.throw(Error);
		});
		it('can pass empty', ()=>
		{
			removeComponentsSpritesFromParent([]).should.be.ok;
		});
		it('passing 3 removes all 3', ()=>
		{
			var mock = ()=>{
				return {
					sprite: {
						parent: {
							removeChild: function()
							{
								this.called = true;
							}
						}
					}
				};
			};
			_.every(removeComponentsSpritesFromParent([mock(), mock(), mock()], (i)=>
			{
				return i.sprite.parent.called;
			}));
		});
	});
	describe('#filterPlayerComponents', ()=>
	{
		it('filters nothing with nothing', ()=>
		{
			filterPlayerComponents().should.be.empty;
		});
		it('filters nothing with empty', ()=>
		{
			filterPlayerComponents([]).should.be.empty;
		});
		it('1 in 3', ()=>
		{
			filterPlayerComponents([
				{player: true},
				{player: false},
				{cow: 'moo'}])
				.should.have.lengthOf(1);
		});
	});
	describe('#filterMonsterComponents', ()=>
	{
		it('filters nothing with nothing', ()=>
		{
			filterMonsterComponents().should.be.empty;
		});
		it('filters nothing with empty', ()=>
		{
			filterMonsterComponents([]).should.be.empty;
		});
		it('2 in 3', ()=>
		{
			filterMonsterComponents([
				{player: true},
				{player: false},
				{cow: 'moo'}])
				.should.have.lengthOf(2);
		});
	});
	describe('#positionComponents', ()=>
	{
		it('no boom on empty', ()=>
		{
			positionComponents.should.not.throw(Error);
		});
		it('sets the X', ()=>
		{
			_.every(positionComponents([
					{sprite: {x: 0, y: 0}},
					{sprite: {x: 0, y: 0}},
					{sprite: {x: 0, y: 0}}
				],
				10, 20, 30
			)
			, i => i.sprite.x === 10);
		});
		it('sets the Y', ()=>
		{
			_.every(positionComponents([
					{sprite: {x: 0, y: 0}},
					{sprite: {x: 0, y: 0}},
					{sprite: {x: 0, y: 0}}
				],
				10, 20, 30
			)
			, (i) => 
			{
				return i.sprite.y === 20 || 
				i.sprite.y === 50 || 
				i.sprite.yy === 80;
			});
		});
	});
	describe('#addComponentSpritesToParent', ()=>
	{
		it('does not blow up with nothing', ()=>
		{
			addComponentSpritesToParent.should.not.throw(Error);
		});
		it('adds all children sprites', ()=>
		{
			var parent = {
				children: [],
				addChild: function(o)
				{
					o.parent = this;
					this.children.push(o);
				}
			};
			_.every(addComponentSpritesToParent([
				{sprite: {}},
				{sprite: {}},
				{sprite: {}}
			], parent
			), c => c.parent === parent);
			parent.children.should.have.lengthOf(3);
		});
	});
	
	
	
});
