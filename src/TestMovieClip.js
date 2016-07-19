import PIXI from 'pixi.js';
import _ from 'lodash';
import Warrior from './com/jessewarden/ff6rx/sprites/warrior/Warrior';
import 'gsap';

var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.interactive = true;

var w = new Warrior();
stage.addChild(w.sprite);
w.sprite.x = 400;
w.sprite.y = 20;

animate();

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

delayed(1000, ()=>
{
	w.walk();
});

function animate()
{
	requestAnimationFrame(()=>
	{
		animate();
	});
	renderer.render(stage);
}

w.stand();
w.gotoAndStop(1);

var me = this;
var tl = new TimelineMax();
var startWX = w.sprite.x;
var startWY = w.sprite.y;

var bezier = [
	{ x: startWX, y: startWY}, 
	{x: 100, y: 100},
	{ x: 50, y: 200}
];

var bezier2 = [
	{ x: 50, y: 200},
	{x: 100, y: 100},
	{ x: startWX, y: startWY}
];

tl.add( TweenMax.to(w.sprite, 0.7, {
	bezier: {
		type: 'thru',
		values: bezier,
		curviness: 2
	},
	ease: Linear.easeInOut,
    onStart: ()=>
	{
		w.attack();
	}
}));
tl.add( TweenMax.to(w.sprite, 0.3, {onStart: ()=>
{
	w.attack2();
	w.attackAnimation();
}}));
tl.add( TweenMax.to(w.sprite, 0.3, {onStart: ()=>
{
	w.attack();
}}));
tl.add( TweenMax.to(w.sprite, 0.3, {onStart: ()=>
{
	w.attack2();
	w.attackAnimation();
}}));
tl.add( TweenMax.to(w.sprite, 0.7, {
	bezier: {
		type: 'thru',
		values: bezier2,
		curviness: 2
	},
	ease: Linear.easeInOut, onStart: ()=>
{
	w.raise();
	w.faceRight();
},
onComplete: ()=>
{
	w.stand();
	w.faceLeft();
	tl.restart();
}}));

