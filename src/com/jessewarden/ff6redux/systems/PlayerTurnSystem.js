import _ from 'lodash';
import { PLAYER_TURN } from '../core/actions';
import { noPlayer } from '../reducers/startState';

let _unsubscribe;
let notNil = _.negate(_.isNil);

export function PlayerTurnSystem(store)
{
	_unsubscribe = store.subscribe(()=>
	{
		handleStateChange(store);
	});

	handleStateChange(store);
}

export function handleStateChange(store)
{
	var state = store.getState();
	if(state.playerWhoseTurnItIs === noPlayer)
	{
		var readyCharacter = getFirstReadyCharacter(state.components);
		if(notNil(readyCharacter))
		{
			store.dispatch({
				type: PLAYER_TURN,
				player: readyCharacter.entity,
				stage: getStage(state.components),
				battleMenusContainer: getBattleMenusContainer(state.components),
				keyboardMangager: getKeyboardManager(state.components),
				cursorManager: getCursorManager(state.components)
			});
		}
	}
}

export function getStage(components)
{
	return _.find(components, c => c.type === 'StageComponent').stage;
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

export function getCursorManager(components)
{
	return _.chain(components)
	.filter(c => c.type === 'CursorManagerComponent')
	.head()
	.value()
	.cursorManager;
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

