import PIXI from 'pixi.js';
import _ from 'lodash';
import 'gsap';
import Menu from './com/jessewarden/ff6redux/components/Menu'

var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.interactive = true;

testMenu();

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

function testMenu()
{
	animate();

	var menu = new Menu(320, 160, [
		{name: 'Uno'},
		{name: 'Dos'},
		{name: 'Tres'}
	]);
	menu.container.x = 100;
	menu.container.y = 100;
	stage.addChild(menu.container);
	menu.changes
	.subscribe((event)=>
	{
		console.log("event:", event);
	});
}

function animate()
{
	requestAnimationFrame(()=>
	{
		animate();
	});
	renderer.render(stage);
}


