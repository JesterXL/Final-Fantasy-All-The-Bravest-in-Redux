import PIXI from 'pixi.js';
import _ from 'lodash';
import Goblin from './com/jessewarden/ff6redux/sprites/goblin/Goblin';
import 'gsap';
import CursorManager from './com/jessewarden/ff6redux/managers/CursorManager';
import KeyboardManager from './com/jessewarden/ff6redux/managers/KeyboardManager';

var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.interactive = true;

testCursor();

function delayed(milliseconds, callback)
{
	return new Promise((success, failure)=>
	{
		setTimeout(()=>
		{
			callback();
			success();
		}, milliseconds);
	});
}

function getGoblin(x, y)
{
	var g = new Goblin();
	stage.addChild(g.sprite);
	g.sprite.x = x;
	g.sprite.y = y;
	return g.sprite;
}

function testCursor()
{
	animate();

	var targets = [
		getGoblin(100, 100),
		getGoblin(200, 200),
		getGoblin(300, 300),
		getGoblin(400, 400),
		getGoblin(500, 500)
	];

	var key = new KeyboardManager();
	var cursor = new CursorManager(stage, key);
	cursor.changes
	.subscribe(e => console.log("cursor:", e));
	cursor.setTargets(targets);
}

function animate()
{
	requestAnimationFrame(()=>
	{
		animate();
	});
	renderer.render(stage);
}


