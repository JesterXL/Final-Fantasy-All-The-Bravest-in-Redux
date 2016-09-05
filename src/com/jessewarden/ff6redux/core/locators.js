import _ from 'lodash';

export function hasStageComponent(components)
{
	return _.findIndex(components, c => c.type === 'StageComponent') > -1;
}

export function getStageComponent(components)
{
	return _.find(components, c => c.type === 'StageComponent');
}

export function hasPIXIComponents(components)
{
	return _.findIndex(components, c => c.type === 'PIXIContainer') > -1;
}

export function hasPIXIRendererComponent(components)
{
	return _.findIndex(components, c => c.type === 'PIXIRenderer') > -1;
}

export function getPIXIRendererComponent(components)
{
	return _.find(components, c => c.type === 'PIXIRenderer');
}

export function getStage(components)
{
	return getStageComponent(components).stage;
}

export function getBattleMenusContainer(components)
{
	return _.find(components, c => c.type === 'PIXIContainer' && c.name === 'battleMenus').container;
}

export function getKeyboardManager(components)
{
	return _.chain(components)
	.filter(c => c.type === 'KeyboardManagerComponent')
	.head()
	.value()
	.keyboardManager;
}


export function getFirstReadyCharacter(components)
{
	return _.chain(components)
	.filter(c => c.type === 'Character')
	.filter(c => c.characterType === 'player')
	.filter(c => c.percentage >= 1)
	.head()
	.value();
}

// export function getComponentFromCharacter(components, character)
// {
// 	return _.chain(components)
// 	.filter(getSpriteComponentsFromComponents)
// 	.find(c => c.character === character)
// 	.value();
// }

export function getComponentIndexFromCharacter(components, character)
{
	return _.chain(components)
	.filter(getSpriteComponentsFromComponents)
	.findIndex(c => c.entity === character.entity)
	.value();
}

export function getCursorManager(components)
{
	return _.chain(components)
	.filter(c => c.type === 'CursorManagerComponent')
	.head()
	.value()
	.cursorManager;
}

export function getSpriteComponentsFromComponents(components)
{
	return _.filter(components, c => c.type === 'ComponentSprite');
}

export function getComponentSpriteFromEntity(components, entity)
{
	return _.chain(getSpriteComponentsFromComponents(components))
	.find(c => c.entity === entity)
	.value();
}

export function reduceSpriteComponentsToSprites(components)
{
	return _.chain(getSpriteComponentsFromComponents(components))
	.reduce((arr, cs)=> {
		arr.push(cs.sprite);
		return arr;
	}, [])
	.value();
}

export function getCharacterFromSprite(components, sprite)
{
	var componentSprite = _.chain(getSpriteComponentsFromComponents(components))
	.filter(c => c.sprite === sprite)
	.head()
	.value();
	console.log("componentSprite:", componentSprite);

	return _.chain(components)
	.filter(c => c.type === 'Character')
	.filter(c => c.entity === componentSprite.entity)
	.head()
	.value();
}