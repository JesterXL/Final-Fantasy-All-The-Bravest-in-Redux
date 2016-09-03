import CursorManager from '../managers/CursorManager';

export function CursorManagerComponent(entity)
{
	return {
		type: 'CursorManagerComponent',
		entity,
		cursorManager: new CursorManager()
	};
}