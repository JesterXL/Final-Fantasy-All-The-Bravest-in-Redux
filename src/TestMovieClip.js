import PIXI from 'pixi.js';
import _ from 'lodash';
import Warrior from './com/jessewarden/ff6redux/sprites/warrior/Warrior';
import Goblin from './com/jessewarden/ff6redux/sprites/goblin/Goblin';
import GoblinAttack from './com/jessewarden/ff6redux/sprites/goblin/GoblinAttack';
import 'gsap';

var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.interactive = true;

// testWarrior();
// testWarriorHit();
// testGoblin();
// testGoblinAttack();

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

function testWarriorHit()
{
	var w = new Warrior();
	stage.addChild(w.sprite);
	w.sprite.x = 400;
	w.sprite.y = 20;

	animate();

	delayed(1000, ()=>
	{
		w.hitAnimation();
	});
}

function testGoblinAttack()
{
	var a = new GoblinAttack();
	stage.addChild(a.sprite);
	// a.sprite.x = 100;
	// a.sprite.y = 100;
	animate();
	delayed(2000, ()=>
	{
		a.play().then(()=> console.log("sup1"));
	});
	delayed(3000, ()=>
	{
		a.play().then(()=> console.log("sup2"));
	});
	delayed(4000, ()=>
	{
		a.play().then(()=> console.log("sup3"));
	});
}

function testGoblin()
{
	var g = new Goblin();
	stage.addChild(g.sprite);
	animate();
	g.sprite.x = 100;
	g.sprite.y = 100;
}

function testWarrior()
{
	var w = new Warrior();
	stage.addChild(w.sprite);
	w.sprite.x = 400;
	w.sprite.y = 20;

	animate();

	delayed(1000, ()=>
	{
		w.walk();
	});

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
}

function animate()
{
	requestAnimationFrame(()=>
	{
		animate();
	});
	renderer.render(stage);
}


