import {Subject} from 'rx';
import Menu from './Menu';
import {
	EVENT_ESCAPE,
	EVENT_SELECTED,
	EVENT_MOVE_RIGHT,
	EVENT_MOVE_LEFT
} from '../managers/CursorManager';

const log = console.log;

export default class BattleMenu extends PIXI.Container
{
	constructor(cursorManager, store)
	{
		super();

		const me = this;
		
		me.changes = new Subject();
		me.cursorManager = cursorManager;

		me.mainMenuItems = []
		me.mainMenuItems.push({name: "Attack"});
		me.mainMenuItems.push({name: "Items"});

		me.mainMenu = new Menu(me.mainMenuItems, 156, 120);
		me.addChild(me.mainMenu);
		me.mainMenu.x = 34;
		me.mainMenu.y = 100;

		me.defendMenuItems = []
		me.defendMenuItems.push({name: "Defend"});

		me.defendMenu = new Menu(me.defendMenuItems, 156, 120);
		me.addChild(me.defendMenu);
		me.defendMenu.x = me.mainMenu.x + 30;
		me.defendMenu.y = me.mainMenu.y;

		me.rowMenuItems = [];
		me.rowMenuItems.push({name: "Change Row"});

		me.rowMenu = new Menu(me.rowMenuItems, 156, 120);
		me.addChild(me.rowMenu);
		me.rowMenu.x = me.mainMenu.x - 30;
		me.rowMenu.y = me.mainMenu.y;

		me.setState('hide');
		me.cursorManager.changes.subscribe( event =>
		{
			const type = event.type;
			switch(type)
			{
				case EVENT_MOVE_RIGHT:
					log("move right");
					if(me.state == 'main')
					{
						me.setState('defense');
					}
					else if(me.state == 'row')
					{
						me.setState('main');
					}
					break;

				case EVENT_MOVE_LEFT:
					log("move left");
					if(me.state == 'defense')
					{
						me.setState('main');
					}
					else if(me.state == 'main')
					{
						me.setState('row');
					}
					break;
			}
		});
	}

	setState(newState)
	{
		const me = this;
		const oldState = me.state;
		switch(oldState)
		{
			case 'defense':
				me.defendMenu.visible = false;
				break;
			case 'row':
				me.rowMenu.visible = false;
				break;
		}
		me.state = newState;
		switch(newState)
		{
			case 'hide':
				me.mainMenu.visible = false;
				me.defendMenu.visible = false;
				me.rowMenu.visible = false;
				if(me.cursorManager)
				{
					me.cursorManager.clearAllTargets();
				}
				break;
			case 'main':
				me.mainMenu.visible = true;
				me.cursorManager.setTargets(me.mainMenu.targets);
				break;
			case 'defense':
				me.defendMenu.visible = true;
				me.cursorManager.setTargets(me.defendMenu.targets);
				break;
				// leave defense
				// me.defendMenu.visible = false;
			case 'row':
				me.rowMenu.visible = true;
				me.cursorManager.setTargets(me.rowMenu.targets);
				break;
				// leave row
				// me.rowMenu.visible = false;
			case 'attack':
				me.mainMenu.visible = false;
				me.defendMenu.visible = false;
				me.rowMenu.visible = false;
				me.cursorManager.setTargets(me.mainMenu.targets);
				break;
		}
	}

	tearDown()
	{
		const me = this;
		
		me.mainMenu.parent.parent.removeChild(me.mainMenu);
		me.defendMenu.parent.parent.removeChild(me.defendMenu);
		me.rowMenu.parent.parent.removeChild(me.rowMenu);

		me.cursorManagerChanges.dispose();
		me.cursorManagerChanges = undefined;
		me.cursorManager.tearDown();
		me.cursorManager = undefined;
		me.keyboardManager = undefined;
	}

	show()
	{
		this.setState("main");
	}

	hide()
	{
		this.setState("hide");
	}
}