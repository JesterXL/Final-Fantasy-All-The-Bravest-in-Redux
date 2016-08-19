import _ from 'lodash';
import PIXI from 'pixi.js';

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
		addRemoveSprites(
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

export function addRemoveSprites(components, 
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
	// console.log("spriteComponentsToRemove:", spriteComponentsToRemove);
	// console.log("entities:", entities);
	removePlayerSprites(spriteComponentsToRemove);
	removeMonsterSprites(spriteComponentsToRemove);
	startSpriteY -= (startSpriteY * spriteComponentsToRemove.length);

	// TODO: we actually already have created the componnets, we just
	// need to apply them in this system. For now, we'll use the parent == null
	// as a mutable state way of knowing if they need to be applied or not.
	// Not sure I want systems being responsible for actually creating components.
	// var spriteComponentsToAdd = getSpriteComponentsFromComponents(
	// 	entitiesToCreateComponentsFor(
	// 		components, 
	// 		entities
	// 	)
	// );
	var spriteComponentsToAdd = _.filter(components, (comp)=>
	{
		return comp.sprite &&
		 _.isNil(comp.sprite.parent) &&
		 _.includes(spriteComponentsToRemove, comp) === false;
	});
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
	return _.forEach(components, (component)=>
	{
		component.sprite.parent.removeChild(component.sprite);
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