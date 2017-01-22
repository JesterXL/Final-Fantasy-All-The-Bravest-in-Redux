import PIXI from 'pixi.js';

export function PIXIRenderer(entity)
{
	return {
		type: 'PIXIRenderer',
		entity,
		renderer: PIXI.autoDetectRenderer(240, 224, { 
			antialias: true,
			background: 0xFF0000,
			resolution: 1 })
	};
}