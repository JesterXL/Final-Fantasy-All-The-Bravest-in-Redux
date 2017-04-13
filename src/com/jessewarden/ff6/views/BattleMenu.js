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
		// me.lastCursorManagerEvent = undefined;
		
		store.subscribe(()=>
		{
			const state = store.getState();
			const cursorManagerTargets = _.get(state, 'cursorManagerTargets');
			// if(cursorManagerTargets.event === me.lastCursorManagerEvent)
			// {
			// 	return;
			// }
			const currentState = me.state;
			switch(cursorManagerTargets.event)
			{
				case EVENT_MOVE_RIGHT:
					if(currentState == 'main')
					{
						me.setState('defense');
					}
					else if(currentState == 'row')
					{
						me.setState('main');
					}
					break;

				case EVENT_MOVE_LEFT:
					if(currentState == 'defense')
					{
						me.setState('main');
					}
					else if(currentState == 'main')
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
				me.cursorManager.setTargets(me.mainMenu, me.mainMenu.targets);
				break;
			case 'defense':
				me.defendMenu.visible = true;
				me.cursorManager.setTargets(me.defendMenu, me.defendMenu.targets);
				break;
				// leave defense
				// me.defendMenu.visible = false;
			case 'row':
				me.rowMenu.visible = true;
				me.cursorManager.setTargets(me.rowMenu, me.rowMenu.targets);
				break;
				// leave row
				// me.rowMenu.visible = false;
			case 'attack':
				me.mainMenu.visible = false;
				me.defendMenu.visible = false;
				me.rowMenu.visible = false;
				me.cursorManager.setTargets(me.mainMenu, me.mainMenu.targets);
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