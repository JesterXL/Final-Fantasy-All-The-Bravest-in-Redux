import _ from 'lodash';
import { PLAYER_TURN } from '../core/actions';
import { noPlayer } from '../reducers/startState';
import { 
	getFirstReadyCharacter
} from '../core/locators';

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
				player: readyCharacter,
				store
			});
		}
	}
}
