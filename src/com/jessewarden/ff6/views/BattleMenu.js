import {Subject} from 'rx';
import Menu from './Menu';

const log = console.log;

export default class BattleMenu extends PIXI.Container
{
	get changes()
	{
		return this.mainMenu.changes;
	}
	
	// [jwarden 4.14.2017] TODO: need to know about store
	// so can disable certain actions based on statuses
	constructor(store)
	{
		super();

		const me = this;

		me.mainMenuItems = []
		me.mainMenuItems.push({name: "Attack"});
		me.mainMenuItems.push({name: "Items"});
		me.mainMenuItems.push({name: "Defend"});
		me.mainMenuItems.push({name: "Change Row"});
		me.mainMenu = new Menu(me.mainMenuItems, 300, 200);
		me.addChild(me.mainMenu);
	}

}
