import "gsap";
import {Subject} from 'rx';
const log = console.log;

export default class Menu extends PIXI.Container
{
	get targets(){ return this._items.children;}

	constructor(menuItems, width=320, height=160)
	{
        super();
        const me = this;
		me._width = width;
		me._height = height;
		me._menuItems = menuItems;

		me.createChildren();
	}

	createChildren()
	{
		const me = this;

		me._border = new PIXI.Graphics();
		me._border.beginFill(0x0000FF);
		me._border.lineStyle(2, 0xFFFFFF, 1);
		me._border.drawRoundedRect(0, 0, me._width, me._height, 6);
		me.addChild(me._border);

		me._items = new PIXI.Container();
		me.addChild(me._items);

		me.changes = new Subject();

		me._fieldPool = [];
		me._spritePool = [];

		me.redraw();
	}

	getTextField()
	{
		const me = this;
		if(me._fieldPool.length > 0)
		{
			return me._fieldPool.pop();
		}
		else
		{
			const style = {

			    fontFamily: 'Final Fantasy VI SNESa',
			    fill : '#FFFFFF',
			    dropShadow : true,
			    dropShadowColor : '#000000',
			    dropShadowAngle : Math.PI / 6,
			    dropShadowDistance : 2,
			    wordWrap : false,
                fontSize: 36
			};
			const textField = new PIXI.Text('???');
            // const textField = new PIXI.extras.BitmapText("???", {font: "36px Final Fantasy VI SNESa"});
            textField.style = new PIXI.TextStyle(style);
			textField.interactive = true;
			return textField;
		}
	}

	getSprite()
	{
		var vm = this;
		if(me._spritePool.length > 0)
		{
			return me._spritePool.pop();
		}
		else
		{
			return new PIXI.Sprite();
		}
	}

    getTextFieldFromMenuItem(menuItem)
    {
        const me = this;
        const field = me.getTextField();
        field.text = menuItem.name;
        const style = field.style;
        if(menuItem.disabled)
        {
            field.interactive = false;
            style.fill = "#666666";
        }
        else
        {
            field.interactive = true;
            style.fill = "#FFFFFF";
        }
        field.on('mouseup', (event)=>
        {
            me.changes.onNext(
                { type: 'click', menuItem }
            );
        });
        return field;
    }

    setMenuItems(newMenuItems)
    {
        const me = this;
        me._menuItems = newMenuItems;
        me.redraw();
    }

	redraw()
	{
		const me = this;
		if(me._items.children.length > 1)
		{
			while(me._items.children.length > 0)
			{
				const removedField = me._items.removeChildAt(me._items.children.length - 1);
                me._fieldPool.push(removedField);
			}
		}

		if(_.isNil(me._menuItems) === true)
		{
			return;
		}

        let startX = 16;
		let startY = 8;
        _.chain(me._menuItems)
        .map(item => me.getTextFieldFromMenuItem(item))
        .forEach(field =>
        {
            field.x = startX;
            field.y = startY;
            startY += 24;
			me._items.addChild(field);
        })
        .value();
	}
}