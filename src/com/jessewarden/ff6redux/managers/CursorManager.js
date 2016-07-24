import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import "howler";
import {Subject} from 'rx';

export default class CursorManager
{
	constructor(stage, keyboardManager)
	{
		var vm = this;
		vm.stage = stage;
		vm.keyboardManager = keyboardManager;
		vm._changes = new Subject();

		var prefix = 'src/com/jessewarden/ff6redux/managers/';
		var cursorPath = prefix + "cursor.png";
		vm.cursorTexture  = new PIXI.Texture.fromImage(cursorPath);
		vm.sprite = new PIXI.Sprite(vm.cursorTexture);
		stage.addChild(vm.sprite);

		vm.targets = [];
		vm._selectedIndex = -1;
		vm._setCursorVisible(false);

		this.beepSound = new Howl({
		  urls: ['src/audio/menu-beep.mp3']
		});
		this.beepSound.volume(0.2);

		vm.keyboardManager.changes
		.filter(e => event.type === 'keydown')
		.subscribe((event)=>
		{
			// console.log("CursorManager::keyboard:", event.type);
			var prevent = false;
			switch(event.keyCode)
			{
				case 87: // w
				case 38: // up arrow
					prevent = true;
					vm.previousTarget();
					break;

				case 83: // s
				case 40: // down arrow
					prevent = true;
					vm.nextTarget();
					break;

				case 13: // enter
					//_controller.add(new CursorFocusManagerEvent(
					//CursorFocusManagerEvent.SELECTED));
					prevent = true;
					vm._changes.onNext({type: 'cursorManager:selected'});
					break;

				case 39: // right
					//_controller.add(new CursorFocusManagerEvent(
					//CursorFocusManagerEvent.MOVE_RIGHT));
					prevent = true;
					vm._changes.onNext({type: 'cursorManager:moveRight'});
					break;

				case 37: // left
					//_controller.add(new CursorFocusManagerEvent(
					//CursorFocusManagerEvent.MOVE_LEFT));
					prevent = true;
					vm._changes.onNext({type: 'cursorManager:moveLeft'});
					break;
			}
			if(prevent)
			{
				event.preventDefault();
			}
		});
	}
	
	hackToTop()
	{
		this.stage.setChildIndex(this.sprite, this.stage.children.length - 1);
	}

	setTargets(parent, list)
	{
		this.targetsParent = parent;
		this.targets = _.map(list, i => i);
		this.hackToTop();
		this.toggleVisibility();
		this.selectedIndex = 0;
	}

	addTarget(target)
	{
		var success = false;
		if(_.includes(this.targets, target) === false)
		{
			this.targets.push(target);
			success = true;
		}
		this.toggleVisibility();
		return success;
	}

	removeTarget(target)
	{
		var success = false;
		if(_.includes(this.targets, target) === true)
		{
			_.remove(this.targets, i => i === target);
			success = true;
		}
		this.toggleVisibility();
		return success;
	}

	clearAllTargets()
	{
		_.remove(this.targets, i => true);
		this._setCursorVisible(false);
		this.toggleVisibility();
	}

	toggleVisibility()
	{
		if(_.isNil(this.targets) || this.targets.length < 1)
		{
			this._setCursorVisible(false);
		}
		else
		{
			this._setCursorVisible(true);
		}
	}

	get selectedIndex(){ return this._selectedIndex};
	set selectedIndex(newValue)
	{
		this._selectedIndex = newValue;
		this._selectCurrentElement();
	}

	_setCursorVisible(show)
	{
		this.sprite.visible = show;
	}

	_selectCurrentElement()
	{
		this._setCursorVisible(false);

		if(this._selectedIndex < 0)
		{
			return;
		}

		if(this.targets.length < 1)
		{
			return;
		}

		var target = this.targets[this._selectedIndex];
		this._setCursorVisible(true);
		console.log("target.parent.y:", this.targetsParent.y);
		var targetPoint = new PIXI.Point(target.x, target.y);
		var point = this.targetsParent.toGlobal(targetPoint);
		console.log("point:", point);
		this.sprite.x = point.x - 16 - 2;
		this.sprite.y = point.y + target.height / 2;
		this.beepSound.play();
	}

	nextTarget()
	{
		if(this.targets.length < 2)
		{
			return;
		}

		if(this._selectedIndex + 1 < this.targets.length)
		{
			this._selectedIndex++;
		}
		else
		{
			this._selectedIndex = 0;
		}
		//_controller.add(new CursorFocusManagerEvent(
		//CursorFocusManagerEvent.INDEX_CHANGED));
		this._selectCurrentElement();
		this._changes.onNext({type: 'cursorManager:indexChanged'});
	}

	previousTarget()
	{
		if(this.targets.length < 2)
		{
			return;
		}

		if(this._selectedIndex - 1 > -1)
		{
			this._selectedIndex--;
		}
		else
		{
			this._selectedIndex = this.targets.length - 1;
		}
		//_controller.add(new CursorFocusManagerEvent(
		//CursorFocusManagerEvent.INDEX_CHANGED));
		this._selectCurrentElement();
		this._changes.onNext({type: 'cursorManager:indexChanged'});
	}

	get changes(){return this._changes;}
}
