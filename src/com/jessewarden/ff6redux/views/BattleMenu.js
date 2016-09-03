import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import {Subject} from 'rx';
import Menu from './Menu';
import CursorManager from '../managers/CursorManager';
import KeyboardManager from '../managers/KeyboardManager';
import StateMachine from '../core/StateMachine';

export default class BattleMenu
{

	get changes(){return this._changes;}

	constructor()
	{
		var vm = this;
		
		vm._changes = new Subject();

		vm.mainMenuItems = []
		vm.mainMenuItems.push({name: "Attack"});
		vm.mainMenuItems.push({name: "Items"});

		vm.mainMenu = new Menu(300, 280, vm.mainMenuItems);
		vm.mainMenu.container.x = 34;
		vm.mainMenu.container.y = 200;

		vm.defendMenuItems = []
		vm.defendMenuItems.push({name: "Defend"});

		vm.defendMenu = new Menu(300, 280, vm.defendMenuItems);
		vm.defendMenu.container.x = vm.mainMenu.container.x + 30;
		vm.defendMenu.container.y = vm.mainMenu.container.y;

		vm.rowMenuItems = [];
		vm.rowMenuItems.push({name: "Change Row"});

		vm.rowMenu = new Menu(300, 280, vm.rowMenuItems);
		vm.rowMenu.container.x = vm.mainMenu.container.x - 30;
		vm.rowMenu.container.y = vm.mainMenu.container.y;

		vm.fsm = new StateMachine();
		// vm.fsm.changes.subscribe((event)=>
		// {
		// 	// console.log("BattleMenu::fsm::event", event);
		// });

		vm.fsm.addState('hide',
		['*'],
		()=>
		{
			vm.mainMenu.container.visible = false;
			vm.defendMenu.container.visible = false;
			vm.rowMenu.container.visible = false;
			if(vm.cursorManager)
			{
				vm.cursorManager.clearAllTargets();
			}
		});

		vm.fsm.addState("main",
		['*'],
		()=>
		{
			vm.mainMenu.container.visible = true;
			vm.cursorManager.setTargets(vm.mainMenu.container, vm.mainMenu.targets);
		});

		vm.fsm.addState("defense", 
		["main"],
		()=>
		{
			vm.defendMenu.container.visible = true;
			vm.cursorManager.setTargets(vm.defendMenu.container, vm.defendMenu.targets);
		},
		()=>
		{
			vm.defendMenu.container.visible = false;
		});
		
		vm.fsm.addState("row", 
		["main"],
		()=>
		{
			vm.rowMenu.container.visible = true;
			vm.cursorManager.setTargets(vm.rowMenu.container, vm.rowMenu.targets);
		},
		()=>
		{
			vm.rowMenu.container.visible = false;
		});

		vm.fsm.addState("attack",
		['*'],
		()=>
		{
			vm.mainMenu.container.visible = false;
			vm.defendMenu.container.visible = false;
			vm.rowMenu.container.visible = false;
			vm.cursorManager.setTargets(vm.mainMenu.container, vm.mainMenu.targets);
		});

		vm.fsm.initialState = 'hide';

	}

	setup(stage, containerToAddTo, keyboardManager, cursorManager)
	{
		var vm = this;
		vm.stage = stage;
		vm.containerToAddTo = containerToAddTo;

		vm.containerToAddTo.addChild(vm.mainMenu.container);
		vm.containerToAddTo.addChild(vm.defendMenu.container);
		vm.containerToAddTo.addChild(vm.rowMenu.container);

		vm.keyboardManager = keyboardManager;
		vm.cursorManager = cursorManager;
		vm.cursorManager.setup(stage, keyboardManager);
		vm.cursorManagerChanges = vm.cursorManager.changes
		.subscribe((event)=>
		{
			// console.log("BattleMenu::cursorManager::subscribe, event:", event);
			var currentState = vm.fsm.currentState.name;
			var fsm = vm.fsm;
			switch(event.type)
			{
				case 'cursorManager:moveRight':
					if(currentState == 'main')
					{
						fsm.changeState('defense');
					}
					else if(currentState == 'row')
					{
						fsm.changeState('main');
					}
					break;

				case 'cursorManager:moveLeft':
					if(currentState == 'defense')
					{
						fsm.changeState('main');
					}
					else if(currentState == 'main')
					{
						fsm.changeState('row');
					}
					break;

				case 'cursorManager:selected':
					var selectedItem;
					switch(currentState)
					{
						case "main":
							selectedItem = vm.mainMenuItems[vm.cursorManager.selectedIndex].name;
							break;

						case "defense":
							selectedItem = vm.defendMenuItems[vm.cursorManager.selectedIndex].name;
							break;

						case "row":
							selectedItem = vm.rowMenuItems[vm.cursorManager.selectedIndex].name;
							break;
					}
					// fsm.changeState('hide');
					vm._changes.onNext({type: 'battleMenu:itemSelected', item: selectedItem});
					break;
			}
		});
	}

	tearDown()
	{
		var vm = this;
		vm.stage = undefined;
		vm.containerToAddTo = undefined;

		vm.mainMenu.container.parent.removeChild(vm.mainMenu.container);
		vm.defendMenu.container.parent.removeChild(vm.defendMenu.container);
		vm.rowMenu.container.parent.removeChild(vm.rowMenu.container);

		vm.cursorManagerChanges.dispose();
		vm.cursorManagerChanges = undefined;
		vm.cursorManager.tearDown();
		vm.cursorManager = undefined;
		vm.keyboardManager = undefined;
	}

	show()
	{
		this.fsm.changeState("main");
	}

	hide()
	{
		this.fsm.changeState("hide");
	}
}