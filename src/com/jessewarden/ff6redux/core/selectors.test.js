import {expect, assert, should } from 'chai';
should();
import guid from '../core/guid';
import { StageComponent } from '../components/StageComponent';
import { PIXIContainer } from '../components/PIXIContainer';
import { PIXIRenderer } from '../components/PIXIRenderer';
import { Character, makeReadyCharacter } from '../battle/Character';
import WarriorSprite from '../sprites/warrior/WarriorSprite';
import CursorManager from '../managers/CursorManager';
import KeyboardManager from '../managers/KeyboardManager';
import BattleState from '../enums/BattleState';

import {
	hasStageComponent,
	hasPIXIComponents,
	hasPIXIRendererComponent,
	getPIXIRendererComponent,
	getBattleMenusContainer,
	getFirstReadyCharacter,
	getComponentIndexFromCharacter,
	getSpriteComponentsFromComponents,
	getComponentSpriteFromEntity,
	getComponentSpriteFromSprite,
	reduceSpriteComponentsToSprites,
	getCharacterFromSprite,
	getAllComponentsForEntity,
	getCursorManager,
	getKeyboardManager,
	getStageComponent,
	getAliveSpriteTargets
} from './selectors';

describe('#selectors', ()=>
{
	describe('#hasStageComponent', ()=>
	{
		it('true when there', ()=>
		{
			hasStageComponent({components: [StageComponent(guid())]}).should.be.true;
		});
		it('false none when not', ()=>
		{
			hasStageComponent({components: []}).should.be.false;
		});
	});
	describe('#hasPIXIComponents', ()=>
	{
		it('true when there', ()=>
		{
			hasPIXIComponents({components: [PIXIContainer(guid(), 'test')]}).should.be.true;
		});
		it('false none when not', ()=>
		{
			hasPIXIComponents({components: []}).should.be.false;
		});
	});
	describe('#hasPIXIRendererComponent', ()=>
	{
		it('true when there', ()=>
		{
			hasPIXIRendererComponent({components: [PIXIRenderer(guid())]}).should.be.true;
		});
		it('false none when not', ()=>
		{
			hasPIXIRendererComponent({components: []}).should.be.false;
		});
	});
	describe('#getPIXIRendererComponent', ()=>
	{
		it('true when there', ()=>
		{
			const comp = PIXIRenderer(guid());
			getPIXIRendererComponent({components: [comp]}).should.equal(comp);
		});
		it('false none when not', ()=>
		{
			expect(getPIXIRendererComponent({components: []})).to.not.exist;
		});
	});
	describe('#getBattleMenusContainer', ()=>
	{
		it('true when there', ()=>
		{
			const comp = PIXIContainer(guid(), 'battleMenus');
			getBattleMenusContainer({components: [comp]}).should.equal(comp.container);
		});
		it('false none when not', ()=>
		{
			expect(getBattleMenusContainer({components: []})).to.not.exist;
		});
	});
	describe('#getFirstReadyCharacter', ()=>
	{
		const noneReady = [
			new Character(guid()),
			new Character(guid()),
			new Character(guid())
		];
		const theOneReady = makeReadyCharacter(guid());
		const oneReady = [
			new Character(guid()),
			theOneReady,
			new Character(guid())
		];
		const firstReady = makeReadyCharacter(guid());
		const allReady = [
			firstReady,
			makeReadyCharacter(guid()),
			makeReadyCharacter(guid())
		];

		it('finds when one ready', ()=>
		{
			getFirstReadyCharacter({components: oneReady}).should.equal(theOneReady);
		});
		it('none when nothing there', ()=>
		{
			expect(getFirstReadyCharacter({components: []})).to.not.exist;
		});
		it('none when 3 not ready', ()=>
		{
			expect(getFirstReadyCharacter({components: noneReady})).to.not.exist;
		});
		it('first when 3 ready', ()=>
		{
			getFirstReadyCharacter({components: allReady}).should.equal(firstReady);
		});
	});
	describe('#getComponentIndexFromCharacter', ()=>
	{
		it('works with 1', ()=>
		{
			const entity    = guid();
			const character = Character(entity);
			const sprite    = new WarriorSprite(entity);
			getComponentIndexFromCharacter({components: [sprite, character]}, character).should.be.equal(0);
		});
		it.skip('works with 3', ()=>
		{
			const entity    = guid();
			const character = Character(entity);
			const sprite    = new WarriorSprite(entity);
			getComponentIndexFromCharacter({components: [character, Character(guid()), sprite]}, character).should.be.equal(2);
		});
		it('works with nuffing', ()=>
		{
			const character = Character(guid());
			expect(getComponentIndexFromCharacter({components: []}, character)).to.equal(-1);
		});
	});
	describe('#getSpriteComponentsFromComponents', ()=>
	{
		const entity    = guid();
		const character = Character(entity);
		const sprite    = new WarriorSprite(entity);
		it('gets components in mixed', ()=>
		{
			getSpriteComponentsFromComponents([character, sprite]).should.have.lengthOf(1);
		});
		it('gets component from mixed', ()=>
		{
			getSpriteComponentsFromComponents([character, sprite])[0].should.equal(sprite);
		});
		it('gets nothing from nothing', ()=>
		{
			getSpriteComponentsFromComponents([]).should.have.lengthOf(0);
		});
	});
	describe('#getComponentSpriteFromEntity', ()=>
	{
		const entity    = guid();
		const character = Character(entity);
		const sprite    = new WarriorSprite(entity);
		it('works with mixed', ()=>
		{
			getComponentSpriteFromEntity({components: [character, sprite]}, entity).should.equal(sprite);
		});
		it('works nothing', ()=>
		{
			expect(getComponentSpriteFromEntity({components: []}, entity)).to.not.exist;
		});
	});
	describe('#getComponentSpriteFromSprite', ()=>
	{
		const entity    = guid();
		const character = Character(entity);
		const sprite    = new WarriorSprite(entity);
		it('finds a sprite', ()=>
		{
			getComponentSpriteFromSprite({components: [sprite]}, sprite.sprite).should.equal(sprite);
		});
		it('finds nothing with nothing', ()=>
		{
			expect(getComponentSpriteFromSprite({components: []}, sprite.sprite)).to.equal(undefined);
		});
	});
	describe('#reduceSpriteComponentsToSprites', ()=>
	{
		const entity     = guid();
		const character  = Character(entity);
		const warrior1   = new WarriorSprite(entity);
		const warrior2   = new WarriorSprite(entity);
		const warrior3   = new WarriorSprite(entity);
		const childsPose = new WarriorSprite(entity);
		const spriteLike = (o) => _.get(o, 'position.x', undefined) === 0;
		it('gets sprite from spritecomponents', ()=>
		{
			reduceSpriteComponentsToSprites({components: [warrior1]})[0].should.equal(warrior1.sprite);
		});
		it('gets sprites from spritecomponents', ()=>
		{
			reduceSpriteComponentsToSprites({components: [
				warrior1, 
				warrior2, 
				warrior3,
				childsPose]})[0].should.equal(warrior1.sprite);
		});
		it('they all sprites', ()=>
		{
			_.every(reduceSpriteComponentsToSprites({components: [
				warrior1, 
				warrior2, 
				warrior3,
				childsPose]}), spriteLike).should.be.true;
		});
	});
	describe.only('#getAliveSpriteTargets', ()=>
	{
		const entity1     = guid();
		const entity2     = guid();
		const entity3     = guid();
		const entity4	  = guid();
		const character1  = Character(entity1);
		const character2  = Character(entity2);
		const character3  = Character(entity3);
		const character4  = Character(entity4);
		character4.battleState = BattleState.DEAD;
		const warrior1   = new WarriorSprite(entity1);
		const warrior2   = new WarriorSprite(entity2);
		const warrior3   = new WarriorSprite(entity3);
		const deadWarrior4 = new WarriorSprite(entity4);
		it('gets alive sprites', ()=>
		{
			const aliveSpriteTargets = getAliveSpriteTargets({components: [
				entity1,
				entity2,
				entity3,
				character1,
				character2,
				character3,
				warrior1,
				warrior2,
				warrior3
			]});
			_.includes(aliveSpriteTargets, warrior1.sprite).should.be.true;
		});
		it('if 1 is dead, only has 1', ()=>
		{
			const aliveSpriteTargets = getAliveSpriteTargets({components: [
				entity1,
				entity4,
				character1,
				character4,
				warrior1,
				deadWarrior4
			]});
			_.includes(aliveSpriteTargets, warrior1.sprite).should.be.true;
		});
		it('if 1 is dead, its not in the list', ()=>
		{
			const aliveSpriteTargets = getAliveSpriteTargets({components: [
				entity1,
				entity4,
				character1,
				character4,
				warrior1,
				deadWarrior4
			]});
			_.includes(aliveSpriteTargets, deadWarrior4.sprite).should.be.false;
		});
	});
	describe('#getCharacterFromSprite', ()=>
	{
		const entity     = guid();
		const character  = Character(entity);
		const warrior    = new WarriorSprite(entity);
		it('works with character', ()=>
		{
			getCharacterFromSprite({components: [warrior, character]}, warrior.sprite).should.equal(character);
		});
		it('returns nothing with no match', ()=>
		{
			expect(getCharacterFromSprite({components: [warrior, character]})).to.equal(undefined);
		});
		it('returns nothing with no character', ()=>
		{
			expect(getCharacterFromSprite({components: [warrior]}, warrior.sprite)).to.equal(undefined);
		});
	});
	describe('#getAllComponentsForEntity', ()=>
	{
		const entity     = guid();
		const character  = Character(entity);
		const warrior    = new WarriorSprite(entity);
		it('works with character', ()=>
		{
			getCharacterFromSprite({components: [warrior, character]}, warrior.sprite).should.equal(character);
		});
		it('returns nothing with no match', ()=>
		{
			expect(getCharacterFromSprite({components: [warrior, character]})).to.equal(undefined);
		});
		it('returns nothing with no character', ()=>
		{
			expect(getCharacterFromSprite({components: [warrior]}, warrior.sprite)).to.equal(undefined);
		});
	});
	describe('#getAllComponentsForEntity', ()=>
	{
		const entity     = guid();
		const character  = Character(entity);
		const warrior    = new WarriorSprite(entity);
		it('works1', ()=>
		{
			getAllComponentsForEntity({components: [character, warrior]}, entity)[0].should.equal(character);
		});
		it('works2', ()=>
		{
			var result = getAllComponentsForEntity({components: [character, warrior]}, entity)[0];
			expect(result.entity).to.equal(warrior.entity);
			// this blows up, no clue why
			// expect(getAllComponentsForEntity({components: [character, warrior]}, entity)[0]).to.equal(warrior.sprite);
		});
	});
	describe('#getCursorManager', ()=>
	{
		const entity     	= guid();
		const cursorManager = new CursorManager();
		it('finds it', ()=>
		{
			getCursorManager({components: [
				{
					type: 'CursorManagerComponent', 
					cursorManager: cursorManager
				}
			]}).should.equal(cursorManager);
		});
		it('blank with nothing', ()=>
		{
			expect(getCursorManager({components: []})).to.equal(undefined);
		});
	});
	describe('#getKeyboardManager', ()=>
	{
		const entity     	= guid();
		const keyboardManager = new KeyboardManager();
		it('gets it', ()=>
		{
			getKeyboardManager({components: [{
				type: 'KeyboardManagerComponent',
				keyboardManager
			}]}).should.equal(keyboardManager);
		});
		it('works with blank', ()=>
		{
			expect(getKeyboardManager({components: []})).to.equal(undefined);
		});
	});
	describe('#getStageComponent', ()=>
	{
		const entity     	= guid();
		const stageComponent = StageComponent(entity);
		it('gets component', ()=>
		{
			getStageComponent({components: [stageComponent]}).should.equal(stageComponent);
		});
		it('fine with nothing', ()=>
		{
			expect(getStageComponent({components: []})).to.equal(undefined);
		});
		it('gets a stage too', ()=>
		{
			getStageComponent({components: [stageComponent]}).stage.should.exist;
		});
	});
});