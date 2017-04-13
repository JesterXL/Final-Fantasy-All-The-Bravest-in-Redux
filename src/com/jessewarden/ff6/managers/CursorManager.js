import { Subject } from 'rx';
const log = console.log;

export const EVENT_ESCAPE = 'cursorManager:escape';
export const EVENT_SELECTED = 'cursorManager:selected';
export const EVENT_MOVE_RIGHT = 'cursorManager:moveRight';
export const EVENT_MOVE_LEFT = 'cursorManager:moveLeft';

export default class CursorManager extends PIXI.Container
{
	constructor(keyboardManager, store)
	{
		super();
		const me = this;
		me.keyboardManager = keyboardManager;

		me.changes = new Subject();

		var prefix = 'src/images/';
		var cursorPath = prefix + "cursor.png";
		me.sprite = new PIXI.Sprite.fromImage(cursorPath);
		me.addChild(me.sprite);

		me.targets = [];
		me._selectedIndex = -1;
		me._setCursorVisible(false);

		me.beepSound = new Howl({
		  src: ['src/audio/menu-beep.mp3', 'src/audio/menu-beep.ogg'],
		  volume: 0.2
		});

		me.setupKeyboard();
	}

	setupKeyboard()
	{
		const me = this;
		let prevent = false;
		me.keyboardManagerChangesSub = me.keyboardManager.changes.subscribe( keyEvent =>
		{
			log("keyCode:", keyEvent.keyCode);
			const keyCode = keyEvent.keyCode;
			switch(keyCode)
			{
				case 0: // Escape
					prevent = true;
					me.changes.onNext({type: EVENT_ESCAPE});
					break;
					
				case 87: // w
				case 38: // up arrow
					prevent = true;
					me.previousTarget();
					break;

				case 83: // s
				case 40: // down arrow
					prevent = true;
					me.nextTarget();
					break;

				case 13: // enter
					prevent = true;
					me.changes.onNext({type: EVENT_SELECTED});
					break;

				case 39: // right
					prevent = true;
					me.changes.onNext({type: EVENT_MOVE_RIGHT});
					break;

				case 37: // left
					prevent = true;
					me.changes.onNext({type: EVENT_MOVE_LEFT});
					break;
			}
			if(prevent)
			{
				event.preventDefault();
			}
		});
	}


	tearDown()
	{
		const me = this;
		if(me.parent)
		{
			me.parent.removeChild(me.sprite);
		}
		me.keyboardManagerChangesSub.dispose();
		me.keyboardManagerChangesSub = undefined;
		me.keyboardManager = undefined;
	}
	
	// TODO
	hackToTop()
	{
		const me = this;
		me.parent.setChildIndex(me, me.parent.children.length - 1);
	}

	setTargets(targets)
	{
		if(_.isNil(targets))
		{
			throw new Error('CursorManager::setTargets requires a targets property.');
		}
		if(_.isArray(targets) === false)
		{
			throw new Error('CursorManager::setTargets, targets must be an Array.');
		}
		const me = this;
		me.targets = targets;
		me.hackToTop();
		me.toggleVisibility();
		me.selectedIndex = 0;
	}

	clearAllTargets()
	{
		const me = this;
		me.targets = undefined;
		me.toggleVisibility();
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

	previousTarget()
	{
		const me = this;
		
		if(_.isArray(me.targets) === false || me.targets.length === 0)
		{
			me.selectedIndex = -1;
		}

		if(me.targets.length === 1)
		{
			me.selectedIndex = 0;
		}

		if(me.selectedIndex - 1 > -1)
		{
			me.selectedIndex = me.selectedIndex - 1;
		}
		else
		{
			me.selectedIndex = me.targets.length - 1;
		}
	}

	nextTarget()
	{
		const me = this;
		if(_.isArray(me.targets) === false || me.targets.length === 0)
		{
			me.selectedIndex = -1;
		}
		if(me.targets.length === 1)
		{
			me.selectedIndex = 0;
		}

		if(me.selectedIndex + 1 < me.targets.length)
		{
			me.selectedIndex = me.selectedIndex + 1;
		}
		else
		{
			me.selectedIndex = 0;
		}
	}

	_setCursorVisible(show)
	{
		this.sprite.visible = show;
	}

	_selectCurrentElement()
	{
		const me = this;
		me._setCursorVisible(false);

		if(me._selectedIndex < 0)
		{
			return;
		}
		log("me._selectedIndex:", me._selectedIndex);
		const target = me.targets[me._selectedIndex];
		me._setCursorVisible(true);
		// console.log("target.parent.y:", this.targetsParent.y);
		me.targetPoint = new PIXI.Point(target.x, target.y);
		me.point = target.parent.toGlobal(me.targetPoint);
		// console.log("point:", point);
		me.sprite.x = me.point.x - 16 - 2;
		me.sprite.y = me.point.y + target.height / 2;
		me.beepSound.play();
	}
	
}
