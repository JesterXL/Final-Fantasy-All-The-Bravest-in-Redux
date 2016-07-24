import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import {Subject} from 'rx';
import Menu from './Menu';
import CursorManager from '../managers/CursorManager';
import keyboardManager from '../managers/keyboardManager';
import StateMachine from '../core/StateMachine';

export default class BattleMenu
{

	get changes(){return this._changes;}

	constructor(stage)
	{
		var vm = this;
		vm.stage = stage;

		vm._changes = new Subject();

		vm.mainMenuItems = []
		vm.mainMenuItems.push({name: "Attack"});
		vm.mainMenuItems.push({name: "Items"});

		vm.mainMenu = new Menu(300, 280, vm.mainMenuItems);
		vm.mainMenu.container.x = 20;
		vm.mainMenu.container.y = 200;

		vm.defendMenuItems = []
		vm.defendMenuItems.push({name: "Defend"});

		vm.defendMenu = new Menu(300, 280, vm.defendMenuItems);
		vm.defendMenu.container.x = vm.mainMenu.container.x + 30;
		vm.defendMenu.container.y = vm.mainMenu.container.y;

		vm.rowMenuItems = [];
		vm.rowMenuItems.push({name: "Change Row"});

		vm.rowMenu = new Menu(300, 280, vm.rowMenuItems);
		vm.rowMenu.x = vm.mainMenu.container.x - 30;
		vm.rowMenu.y = vm.mainMenu.container.y;

		vm.stage.addChild(vm.mainMenu.container);
		vm.stage.addChild(vm.defendMenu.container);
		vm.stage.addChild(vm.rowMenu.container);

		vm.keyboardManager = new keyboardManager();
		vm.cursorManager = new CursorManager(stage, vm.keyboardManager);
		vm.cursorManager.changes
		.subscribe((event)=>
		{
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
					fsm.changeState('hide');
					vm._changes.onNext({type: 'battleMenu:itemSelected', item: selectedItem});
					break;
			}
		});

		vm.fsm = new StateMachine();
		vm.fsm.changes.subscribe((event)=>
		{
			console.log("BattleMenu::fsm::event", event);
		});

		vm.fsm.addState('hide',
		['*'],
		()=>
		{
			console.log("BattleMenu::hide");
			vm.mainMenu.container.visible = false;
			vm.defendMenu.container.visible = false;
			vm.rowMenu.container.visible = false;
			vm.cursorManager.clearAllTargets();
		});

		vm.fsm.addState("main",
		['*'],
		()=>
		{
			console.log("BattleMenu::main");
			vm.mainMenu.container.visible = true;
			vm.cursorManager.setTargets(vm.mainMenu.targets);
		});

		vm.fsm.addState("defense", 
		["main"],
		()=>
		{
			console.log("BattleMenu::defense");
			vm.defendMenu.container.visible = true;
			vm.cursorManager.setTargets(vm.defendMenu.targets);
		},
		()=>
		{
			vm.defendMenu.container.visible = false;
		});
		
		vm.fsm.addState("row", 
		["main"],
		()=>
		{
			console.log("BattleMenu::row");
			vm.rowMenu.container.visible = true;
			vm.cursorManager.setTargets(vm.rowMenu.targets);
		},
		()=>
		{
			vm.rowMenu.container.visible = false;
		});

		vm.fsm.initialState = 'hide';

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