import _ from 'lodash';
import PIXI from 'pixi.js';
import {REMOVE_COMPONENT} from '../core/actions';
import {
	hasStageComponent,
	getStageComponent,
	hasPIXIComponents,
	hasPIXIRendererComponent,
	getPIXIRendererComponent,
	getSpriteComponentsFromComponents
} from '../core/locators';

let _unsubscribe;
var startSpriteX = 400;
var startSpriteY = 20;
var startMonsterSpriteX = 20;
var startMonsterSpriteY = 20;
let _animating = false;

export function SpriteSystem(store)
{
	_unsubscribe = store.subscribe(()=>
	{
		mapStateToThis(store);
	});

	mapStateToThis(store);
}

export function unsubscribe()
{
	_unsubscribe();
}

function mapStateToThis(store)
{
	// console.log("SpriteSystem::mapStateToThis");
	// NOTE: Treating the StageComponent as a Singleton. Not sure the ramifications of this.
	const state = store.getState();
	// console.log("state:", state);
	var result = addOrRemoveStage(state);
	// console.log("result:", result);
	addOrRemovePIXIRenderer(state);
	addOrRemovePIXIComponents(state);
	if(hasStageComponent(state.components) && hasPIXIRendererComponent(state.components))
	{
		addRemoveSprites(store,
			startSpriteX, 
			startSpriteY,
			startMonsterSpriteX,
			startMonsterSpriteY);
	}
}

export function addOrRemovePIXIRenderer(state)
{
	var pixiRendererComponent = getPIXIRendererComponent(state.components);
	if(pixiRendererComponent && hasPIXIRendererInDOM() === false)
	{
		addPIXIRendererToDOM(pixiRendererComponent.renderer.view);
	}
	else if(_.isNil(pixiRendererComponent) && hasPIXIRendererInDOM())
	{
		removePIXIRendererFromDOM();
	}
}

export function addPIXIRendererToDOM(node)
{
	// console.log("b document.body.childNodes:", document.body.childNodes);1
	node.dataset.pixirenderer = 'true';
	var result = document.body.appendChild(node);
	// console.log("a document.body.childNodes:", document.body.childNodes);
	return result;
}

export function hasPIXIRendererInDOM()
{
	return _.findIndex(document.body.childNodes, node => node.dataset.pixirenderer === 'true') > -1;
}

export function getPIXIRendererInDOM()
{
	return _.find(document.body.childNodes, node => node.dataset.pixirenderer === 'true');
} 

export function removePIXIRendererFromDOM()
{
	return document.body.removeChild(getPIXIRendererInDOM());
}

export function addOrRemoveStage(state)
{
	const hasAStage = hasStageComponent(state.components);
	const hasRenderer = hasPIXIRendererComponent(state.components);
	// console.log("*******");
	// console.log("hasAStage:", hasAStage);
	// console.log("hasRenderer:", hasRenderer);
	// console.log("_animating:", _animating);
	if(hasAStage && hasRenderer && _animating === false)
	{
		setupStage(
			getStageComponent(state.components).stage, 
			getPIXIRendererComponent(state.components).renderer
		);
		return true;
	}
	else if( (hasAStage === false || hasRenderer === false) && _animating)
	{
		tearDownStage();
		return false; 
	}
}

export function setupStage(stage, renderer)
{
	_animating = true;
	animate(renderer, stage);
}

export function tearDownStage()
{
	_animating = false;
}

export function addOrRemovePIXIComponents(state)
{
	const hasAStage = hasStageComponent(state.components);
	const hasSomePixiComponents = hasPIXIComponents(state.components);
	if(hasAStage && hasSomePixiComponents)
	{
		const stage = getStageComponent(state.components);
		const unattachedPixiComponents = _.filter(state.components, c => {
			return c.type === 'PIXIContainer' && c.container.parent === null;
		});
		_.forEach(unattachedPixiComponents, c => addToStage(stage.stage, c.container));
		// TODO: keep original children order
		// sortStageChildren(stage);
	}
	else if(hasAStage === false && hasSomePixiComponents)
	{
		const attachedPixiComponents = _.filter(state.components, c => {
			return c.type === 'PIXIContainer' && c.container.parent !== null;
		});
		_.forEach(attachedPixiComponents, c => removeFromParent(c.container));
	}
}

export function addToStage(stage, child)
{
	stage.addChild(child);
}

function removeAllChildren(container)
{
	container.removeChildren();
}

function removeFromParent(container)
{
	container.parent.removeChild(container);	
}

function animate(renderer, stage)
{
	if(_animating === false)
	{
		return;
	}
	requestAnimationFrame(()=>
	{
		animate(renderer, stage);
	});
	renderer.render(stage);
}

export function addRemoveSprites(store,
	startSpriteX, 
	startSpriteY,
	startMonsterSpriteX,
	startMonsterSpriteY)
{
	const state = store.getState();
	const entities = state.entities;
	const components = state.components;

	var spriteComponents = getSpriteComponentsFromComponents(components);
	var spriteComponentsToRemove = componentsToRemove(
		spriteComponents, 
		entities
	);
	// console.log("spriteComponentsToRemove:", spriteComponentsToRemove);
	if(spriteComponentsToRemove.length > 0)
	{	
		removePlayerSprites(spriteComponentsToRemove);
		removeMonsterSprites(spriteComponentsToRemove);
		startSpriteY -= (startSpriteY * spriteComponentsToRemove.length);
		// _.forEach(spriteComponentsToRemove, (component)=>
		// {
		// 	store.dispatch({type: REMOVE_COMPONENT, component});
		// });
	}

	var spriteComponentsToAdd = _.chain(components)
	.filter(getSpriteComponentsFromComponents)
	.filter((comp)=>
	{
		return comp.sprite &&
		 comp.sprite.parent === null &&
		 _.includes(spriteComponentsToRemove, comp) === false;
	})
	.value();

	if(spriteComponentsToAdd.length > 0)
	{
		var playerSpritesContainer = _.chain(components)
		.filter(c => c.type === 'PIXIContainer')
		.filter(c => c.name === 'playerSprites')
		.head()
		.value()
		.container;
		showAndPositionPlayerComponents(spriteComponentsToAdd,
			playerSpritesContainer,
			startSpriteX,
			startSpriteY,
			60);

		// TODO: monsters need different layout algo
		var monsterSpritesContainer = _.chain(components)
		.filter(c => c.type === 'PIXIContainer')
		.filter(c => c.name === 'monsterSprites')
		.head()
		.value()
		.container;
		showAndPositionMonsterComponents(spriteComponentsToAdd,
			monsterSpritesContainer,
			startMonsterSpriteX,
			startMonsterSpriteY,
			100);
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

export function filterCharacterComponents(components)
{
	return _.filter(components, c => c.type === 'Character');
}

export function filterComponentSprites(components)
{
	return _.filter(components, c => c.type === 'ComponentSprite');
}

export function updatePercentageComponents(components, entities)
{
	var characters = filterCharacterComponents(components);
	var componentSprites = filterComponentSprites(components);
	return _.forEach(characters, (chr)=>
	{
		var spriteComp = _.find(componentSprites, c => c.entity === chr.entity);
		if(spriteComp && spriteComp.setPercentage)
		{
			spriteComp.setPercentage(chr.percentage);
		}
	});
}