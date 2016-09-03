import PIXI from 'pixi.js';

export function PIXIRenderer(entity)
{
	return {
		type: 'PIXIRenderer',
		entity,
		renderer: PIXI.autoDetectRenderer(800, 600, { antialias: true, background: 0x000000 })
	};
}