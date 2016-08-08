import PIXI from "pixi.js";
import Point from "../core/Point";
import "gsap";

class TextDropper
{

	constructor(stage)
	{
		this._stage = stage;
		this._pool = [];
	}

	addTextDrop(target, value, color = 0xFFFFFF, miss = false)
	{
		var field = this.getField();
		this._stage.addChild(field);
		var point = new Point(target.x, target.y);
//		point = target.localToGlobal(point);
		field.x = point.x + (target.width / 2) - (field.width / 2);
		field.y = point.y + target.height - field.height;
		// console.log("x: " + field.x + ", y: " + field.y);
		if(miss == false)
		{
			field.text = Math.abs(value);
		}
		else
		{
			field.text = "MISS";
		}
		// field.defaultTextFormat.color = color;
		field.tint = color;

		var me = this;
		var timeline = new TimelineLite();
		timeline.to(field, 0.25, {
			y: field.y - 40,
			ease: Expo.easeOut
		})
		.to(field, 0.45, {
			y: field.y,
			ease: Bounce.easeOut
		})
		.to(field, 0.6, {
			onComplete: ()=>
		{
			me.cleanUp(field);
		}});

	}

	getField()
	{
		if(this._pool.length > 0)
		{
			return this._pool.pop();
		}
		else
		{
			// font : '36px Final Fantasy VI SNESa',

			var style = {
			    
			    font: '36px Arial',
			    fill : '#FFFFFF',
			    stroke : '#000000',
			    strokeThickness : 2,
			    dropShadow : true,
			    dropShadowColor : '#000000',
			    dropShadowAngle : Math.PI / 6,
			    dropShadowDistance : 2,
			    wordWrap : false
			};
			// var style = {
			//     font : 'bold italic 36px Arial',
			//     fill : '#F7EDCA',
			//     stroke : '#4a1850',
			//     strokeThickness : 5,
			//     dropShadow : true,
			//     dropShadowColor : '#000000',
			//     dropShadowAngle : Math.PI / 6,
			//     dropShadowDistance : 6,
			//     wordWrap : true,
			//     wordWrapWidth : 440
			// };
			return new PIXI.Text('???', style);
		}
	}

	cleanUp(field)
	{
		this._stage.removeChild(field);
		this._pool.push(field);
	}
}

export default TextDropper