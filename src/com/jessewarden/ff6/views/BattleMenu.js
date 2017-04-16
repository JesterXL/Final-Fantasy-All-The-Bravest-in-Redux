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

		me.mainMenuItems = [
			{name: 'Attack'},
			{name: 'Items'},
			{name: 'Defend'},
			{name: 'Change Row'}
		];
		me.mainMenu = new Menu(me.mainMenuItems, 300, 200);
		me.addChild(me.mainMenu);

		store.subscribe(()=>
		{
			const state = store.getState();
			if(state.items.length === 0)
			{
				me.setMenuItems(me.mainMenuItems = [
					{name: 'Attack'},
					{name: 'Items', disabled: true},
					{name: 'Defend'},
					{name: 'Change Row'}
				]);
			}
			else
			{
				me.setMenuItems(me.mainMenuItems = [
					{name: 'Attack'},
					{name: 'Items'},
					{name: 'Defend'},
					{name: 'Change Row'}
				]);
			}
		});
	}

	setMenuItems(items)
	{
		this.mainMenu.setMenuItems(items);
	}

}
