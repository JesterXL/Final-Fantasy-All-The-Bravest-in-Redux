import PIXI from 'pixi.js';

export function PIXIContainer(entity, name)
{
	return {
		type: 'PIXIContainer',
		name,
		container: new PIXI.Container(),
		entity
	};
}