class TextDropper extends PIXI.Container
{
	constructor()
	{
        super();
        const me = this;
		me._pool = [];
	}

	addTextDrop(target, value, color = 0xFFFFFF, miss = false)
	{
        const me = this;
		const field = me.getField();
		me.addChild(field);
		const point = {x: target.x, y: target.y};
//		point = target.localToGlobal(point);
		field.x = point.x + (target.width / 2) - (field.width / 2);
		field.y = point.y + target.height - field.height;
		// console.log("x: " + field.x + ", y: " + field.y);
		if(miss === false)
		{
			field.text = Math.abs(value);
		}
		else
		{
			field.text = "MISS";
		}
		// field.defaultTextFormat.color = color;
		field.tint = color;

		const timeline = new TimelineLite();
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
		const me = this;
		if(me._pool.length > 0)
		{
			return me._pool.pop();
		}
		else
		{
			// font : '36px Final Fantasy VI SNESa',

			const style = {
			    
			    fontFamily: '36px Final Fantasy VI SNESa',
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
			const field = new PIXI.Text('???');
            field.style = style;
            return field;
		}
	}

	cleanUp(field)
	{
        const me = this;
		field.parent.removeChild(field);
		me._pool.push(field);
	}
}

export default TextDropper