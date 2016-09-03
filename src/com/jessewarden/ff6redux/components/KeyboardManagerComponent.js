import KeyboardManager from '../managers/KeyboardManager';

export function KeyboardManagerComponent(entity)
{
	return {
		type: 'KeyboardManagerComponent',
		entity,
		keyboardManager: new KeyboardManager()
	};
}