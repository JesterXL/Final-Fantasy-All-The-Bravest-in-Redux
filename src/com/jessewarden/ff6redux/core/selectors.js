// import _ from 'lodash';
// import BattleState from '../enums/BattleState';

// export function hasStageComponent(state)
// {
// 	return _.findIndex(state.components, c => c.type === 'StageComponent') > -1;
// }

// export function hasPIXIComponents(state)
// {
// 	return _.findIndex(state.components, c => c.type === 'PIXIContainer') > -1;
// }

// export function hasPIXIRendererComponent(state)
// {
// 	return _.findIndex(state.components, c => c.type === 'PIXIRenderer') > -1;
// }

// export function getPIXIRendererComponent(state)
// {
// 	return _.find(state.components, c => c.type === 'PIXIRenderer');
// }

// export function getBattleMenusContainer(state)
// {
// 	return _.get(_.find(state.components, c => c.type === 'PIXIContainer' && c.name === 'battleMenus'),
// 		"container", undefined);
// }

// export function getFirstReadyCharacter(state)
// {
// 	return _.chain(state.components)
// 	.filter(c => c.type === 'Character')
// 	.filter(c => c.characterType === 'player')
// 	.filter(c => c.battleState === BattleState.READY)
// 	.head()
// 	.value();
// }

// // export function getComponentFromCharacter(components, character)
// // {
// // 	return _.chain(components)
// // 	.filter(getSpriteComponentsFromComponents)
// // 	.find(c => c.character === character)
// // 	.value();
// // }

// export function getComponentIndexFromCharacter(state, character)
// {
// 	return _.chain(state.components)
// 	.filter(c => c.type === 'ComponentSprite')
// 	.findIndex(c => c.entity === character.entity)
// 	.value();
// }

// export function getSpriteComponentsFromComponents(components)
// {
// 	return _.filter(components, c => c.type === 'ComponentSprite');
// }

// export function getComponentSpriteFromEntity(state, entity)
// {
// 	return _.chain(getSpriteComponentsFromComponents(state.components))
// 	.find(c => c.entity === entity)
// 	.value();
// }

// export function getComponentSpriteFromSprite(state, sprite)
// {
// 	return _.chain(getSpriteComponentsFromComponents(state.components))
// 	.find(c => c.sprite === sprite)
// 	.value();
// }

// export function reduceSpriteComponentsToSprites(state)
// {
// 	return _.chain(getSpriteComponentsFromComponents(state.components))
// 	.reduce((arr, cs)=> {
// 		arr.push(cs.sprite);
// 		return arr;
// 	}, [])
// 	.value();
// }

// export function getAliveSpriteTargets(state)
// {
// 	return _.chain(reduceSpriteComponentsToSprites(state))
// 	.filter(sprite => {
// 		const character = getCharacterFromSprite(state, sprite);
// 		return character.battleState !== BattleState.DEAD;
// 	})
// 	.value();
// }

// export function getCharacterFromSprite(state, sprite)
// {
// 	var componentSprite = _.chain(getSpriteComponentsFromComponents(state.components))
// 	.filter(c => c.sprite === sprite)
// 	.head()
// 	.value();
// 	// console.log("componentSprite:", componentSprite);
// 	if(_.isNil(componentSprite))
// 	{
// 		return undefined;
// 	}

// 	return _.chain(state.components)
// 	.filter(c => c.type === 'Character')
// 	.filter(c => c.entity === componentSprite.entity)
// 	.head()
// 	.value();
// }

// export function getAllComponentsForEntity(state, entity)
// {
// 	return _.filter(state.components, c => c.entity === entity);
// }

// export function getCursorManager(state)
// {
// 	return _.get(_.chain(_.get(state, "components", []))
// 	.filter(c => c.type === 'CursorManagerComponent')
// 	.head()
// 	.value(),
// 	"cursorManager", undefined);
// }

// export function getKeyboardManager(state)
// {
// 	return _.get(_.chain(state.components)
// 	.filter(c => c.type === 'KeyboardManagerComponent')
// 	.head()
// 	.value(),
// 	"keyboardManager", undefined);
// }

// export function getStage(state)
// {
// 	return getStageComponent(state).stage;
// }

// export function getStageComponent(state)
// {
// 	return _.find(state.components, c => c.type === 'StageComponent');
// }

// export function getCharacterFromEntity(state, entity)
// {
// 	return _.find(state.components, c => c.type === 'Character' && c.entity === entity);
// }