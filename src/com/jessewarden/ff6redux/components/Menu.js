import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import {Subject} from 'rx';

export default class Menu
{
	get container(){return this._container;}
	get changes(){ return this._changes; }

	constructor(width=320, height=160, menuItems)
	{
		this._width = 320;
		this._height = 160;
		this._menuItems = menuItems;

		this.createChildren();
	}

	createChildren()
	{
		var vm = this;

		vm._container = new PIXI.Container();

		vm._border = new PIXI.Graphics();
		vm._border.beginFill(0x0000FF);
		vm._border.lineStyle(4, 0xFFFFFF, 1);
		vm._border.drawRoundedRect(0, 0, vm._width, vm._height, 6);
		vm._container.addChild(vm._border);

		vm._items = new PIXI.Sprite();
		vm._items.interactive = true;
		vm._container.addChild(vm._items);

		vm._changes = new Subject();

		vm._fieldPool = [];
		vm._spritePool = [];

		vm.redraw();
	}

	destroy()
	{
	}

	getTextField()
	{
		var vm = this;
		if(vm._fieldPool.length > 0)
		{
			return vm._fieldPool.removeLast();
		}
		else
		{
			var style = {

			    font: '36px Final Fantasy VI SNESa',
			    fill : '#FFFFFF',
			    stroke : '#000000',
			    strokeThickness : 2,
			    dropShadow : true,
			    dropShadowColor : '#000000',
			    dropShadowAngle : Math.PI / 6,
			    dropShadowDistance : 2,
			    wordWrap : false
			};
			var textField = new PIXI.Text('???', style);
			textField.interactive = true;
			return textField;
		}
	}

	getSprite()
	{
		var vm = this;
		if(vm._spritePool.length > 0)
		{
			return vm._spritePool.removeLast();
		}
		else
		{
			return new PIXI.Sprite();
		}
	}

	redraw()
	{
		var vm = this;
		if(vm._items.children.length > 1)
		{
			while(vm._items.children.length > 0)
			{
//				print("len: " + _items.numChildren.toString());
				var removedKid = vm._items.getChildAt(vm._items.children.length - 1);
				vm._items.removeChildAt(vm._items.children.length - 1);
				if(removedKid instanceof TextField)
				{
					vm._fieldPool.add(removedKid);
				}
				else if(removedKid instanceof Sprite)
				{
					vm._spritePool.add(removedKid);
				}
				else
				{
					throw new Error("omg, border, we've got a Dodson here!");
				}
			}
		}

		var startX = 16;
		var startY = 8;

		if(vm._menuItems == null)
		{
			return;
		}

		_.forEach(vm._menuItems, (item)=>
		{
			// create name
			var field = vm.getTextField();
			field.text = item.name;
			var style = field.style;
			if(item.disabled)
			{
				field.interactive = false;
				style.fill = "#666666";
			}
			else
			{
				field.interactive = true;
				style.fill = "#FFFFFF";
			}
			field.x = startX;
			field.y = startY;
			// field.width = 200;
			// field.height = 36;
			startY += 24;
			vm._items.addChild(field);
			field.on('mouseup', (event)=>
			{
				// console.log("field:", field.text);
				vm._changes.onNext(
					{
						type: 'click', 
						menuItem: _.find(vm._menuItems, i => i.name === field.text)
					}
				);
			});
		});
	}
}