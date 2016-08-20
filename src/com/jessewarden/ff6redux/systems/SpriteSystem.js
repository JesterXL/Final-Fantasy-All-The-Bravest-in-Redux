import _ from 'lodash';
import PIXI from 'pixi.js';
import {REMOVE_COMPONENT} from '../core/actions';

export function SpriteSystem(store)
{
	var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
	document.body.appendChild(renderer.view);
	var stage = new PIXI.Container();
	stage.interactive = true;
	var battleTimerBars = new PIXI.Container();
	stage.addChild(battleTimerBars);
	var monsterSprites = new PIXI.Container();
	stage.addChild(monsterSprites);
	var playerSprites = new PIXI.Container();
	stage.addChild(playerSprites);
	var textDrops = new PIXI.Container();
	stage.addChild(textDrops);
	var battleMenus = new PIXI.Container();
	stage.addChild(battleMenus);

	var startSpriteX = 400;
	var startSpriteY = 20;

	animate(renderer, stage);

	var unsubscribe = store.subscribe(()=>
	{
		mapStateToThis();
	});

	function mapStateToThis()
	{
		var state = store.getState();
		addRemoveSprites(store,
			state.components, 
			state.entities, 
			monsterSprites, 
			playerSprites, 
			startSpriteX, 
			startSpriteY
		);
	}

	mapStateToThis();
}

function animate(renderer, stage)
{
	requestAnimationFrame(()=>
	{
		animate(renderer, stage);
	});
	renderer.render(stage);
}

export function addRemoveSprites(store,
	components, 
	entities, 
	monsterSprites,
	playerSprites,
	startSpriteX, 
	startSpriteY)
{
	var spriteComponentsToRemove = getSpriteComponentsFromComponents(
		componentsToRemove(
			components, 
			entities
		)
	);
	// spriteComponentsToRemove = _.filter(spriteComponentsToRemove, c => c.sprite && c.sprite.parent !== null);
	if(spriteComponentsToRemove.length > 0)
	{	
		console.log("spriteComponentsToRemove:", spriteComponentsToRemove);
		removePlayerSprites(spriteComponentsToRemove);
		removeMonsterSprites(spriteComponentsToRemove);
		startSpriteY -= (startSpriteY * spriteComponentsToRemove.length);
		_.forEach(spriteComponentsToRemove, (component)=>
		{
			store.dispatch({type: REMOVE_COMPONENT, component});
		});
	}

	var spriteComponentsToAdd = _.filter(components, (comp)=>
	{
		return comp.sprite &&
		 comp.sprite.parent === null &&
		 _.includes(spriteComponentsToRemove, comp) === false;
	});
	if(spriteComponentsToAdd.length > 0)
	{
		showAndPositionPlayerComponents(spriteComponentsToAdd,
			playerSprites,
			startSpriteX,
			startSpriteY,
			60);

		// TODO: monsters need different layout algo
		showAndPositionMonsterComponents(spriteComponentsToAdd,
			monsterSprites,
			startSpriteX,
			startSpriteY,
			60);
		startSpriteY += (startSpriteY * spriteComponentsToAdd.length);
	}
	
	updatePercentageComponents(components, entities);
}

export function componentsToRemove(components, entities)
{
	return _.differenceWith(
		components,
		entities,
		(comp, entity) => comp.entity === entity);
}

export function entitiesToCreateComponentsFor(components, entities)
{
	return _.differenceWith(
		entities,
		components,
		(entity, comp)=> entity === comp.entity);
}

export function getSpriteComponentsFromComponents(components)
{
	return _.filter(components, c => c.type && c.type === 'componentSprite');
}

export function removeComponentsSpritesFromParent(components)
{
	// console.log("components:", components);
	return _.forEach(components, (component)=>
	{
		component.sprite.parent.removeChild(component.sprite);
		// console.log("component.sprite.parent:", component.sprite.parent);
	});
}

export function filterPlayerComponents(components)
{
	return _.filter(components, comp => comp.player);
}

export function filterMonsterComponents(components)
{
	return _.filter(components, comp => !comp.player);
}

export function positionComponents(components, startSpriteX, startSpriteY, yIncrement)
{
	return _.forEach(components, (comp)=>
	{
		comp.sprite.x = startSpriteX;
		comp.sprite.y = startSpriteY;
		startSpriteY += yIncrement;
	});
}

export function addComponentSpritesToParent(components, parent)
{
	return _.forEach(components, (comp)=>
	{
		parent.addChild(comp.sprite);
	});
}

export function showAndPositionPlayerComponents(components, playerSprites, startSpriteX, startSpriteY, yIncrement)
{
	return addComponentSpritesToParent(
		positionComponents(
			filterPlayerComponents(components), startSpriteX, startSpriteY, yIncrement
		), playerSprites);
}

export function showAndPositionMonsterComponents(components, monsterSprites, startSpriteX, startSpriteY, yIncrement)
{
	return addComponentSpritesToParent(
		positionComponents(
			filterMonsterComponents(components), startSpriteX, startSpriteY, yIncrement
		), monsterSprites);
}

export function removePlayerSprites(components, playerSprites)
{
	return removeComponentsSpritesFromParent(filterPlayerComponents(components));
}

export function removeMonsterSprites(components, monsterSprites)
{
	return removeComponentsSpritesFromParent(filterMonsterComponents(components));
}

export function updatePercentageComponents(components, entities)
{
	// console.log("*** updatePercentageComponents ***");
	// console.log("comp:", components)
	var percentageSprites = _.filter(components, (comp)=>
	{
		_.isNil(comp.setPercentage) === false;
	});
	// console.log("percentageSprites:", percentageSprites);
	if(percentageSprites.length > 0)
	{
		var battleTimers = _.filter(components, c => c.type === 'BattleTimerComponent');
		// console.log("battleTimers:", battleTimers);
		return _.forEach(components, (c) => 
		{
			var matchingBattleTimer = _.find(battleTimers, b => b.entity === c.entity);
			// console.log("matchingBattleTimer.percentage:", matchingBattleTimer.percentage);
			c.setPercentage(matchingBattleTimer.percentage);
		});
	}
}