import PIXI from 'pixi.js';

export function StageComponent(entity)
{
	var stage = new PIXI.Container();
	stage.interactive = true;
	return {
		type: 'StageComponent',
		entity,
		stage
	};
}