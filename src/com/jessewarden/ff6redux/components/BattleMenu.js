class BattleMenu
{
	ObservableList<MenuItem> mainMenuItems;
	ObservableList<MenuItem> defendMenuItems;
	ObservableList<MenuItem> rowMenuItems;
	Menu mainMenu;
	Menu defendMenu;
	Menu rowMenu;
	StateMachine fsm;

	ResourceManager resourceManager;
	CursorFocusManager cursorManager;
	Stage stage;
	StreamController _controller;

	Stream stream;

	BattleMenu(ResourceManager this.resourceManager,
	           CursorFocusManager this.cursorManager,
	           Stage this.stage)
	{
		init();
	}

	void init()
	{
		_controller = new StreamController.broadcast();
		stream = _controller.stream;

		mainMenuItems = new ObservableList<MenuItem>();
		mainMenuItems.add(new MenuItem("Attack"));
		mainMenuItems.add(new MenuItem("Items"));

		mainMenu = new Menu(300, 280, mainMenuItems);
		mainMenu.x = 20;
		mainMenu.y = 200;

		defendMenuItems = new ObservableList<MenuItem>();
		defendMenuItems.add(new MenuItem("Defend"));

		defendMenu = new Menu(300, 280, defendMenuItems);
		defendMenu.x = mainMenu.x + 30;
		defendMenu.y = mainMenu.y;

		rowMenuItems = new ObservableList<MenuItem>();
		rowMenuItems.add(new MenuItem("Change Row"));

		rowMenu = new Menu(300, 280, rowMenuItems);
		rowMenu.x = mainMenu.x - 30;
		rowMenu.y = mainMenu.y;

		fsm = new StateMachine();

		StreamSubscription streamSubscription;

		fsm.addState('hide',
		enter: ()
		{
			mainMenu.removeFromParent();
			defendMenu.removeFromParent();
			rowMenu.removeFromParent();
			cursorManager.clearAllTargets();
			if(streamSubscription != null)
			{
				streamSubscription.cancel();
				streamSubscription = null;
			}
			stage.focus = null;
		});

		fsm.addState("main",
		enter: ()
		{
			stage.addChild(mainMenu);
			cursorManager.setTargets(mainMenu.hitAreas);
			if (streamSubscription == null)
			{
				streamSubscription = getCursorManagerStreamSubscription();
			}
			stage.focus = stage;
		});
		fsm.addState("defense", from: ["main"],
		enter: ()
		{
			stage.addChild(defendMenu);
			cursorManager.setTargets(defendMenu.hitAreas);
		},
		exit: ()
		{
			stage.removeChild(defendMenu);
		});
		fsm.addState("row", from: ["main"],
		enter: ()
		{
			stage.addChild(rowMenu);
			cursorManager.setTargets(rowMenu.hitAreas);
		},
		exit: ()
		{
			stage.removeChild(rowMenu);
		});


		resourceManager.load()
		.then((_)
		{
			fsm.initialState = 'hide';
		});
	}

	StreamSubscription getCursorManagerStreamSubscription()
	{
		return cursorManager.stream
		.listen((CursorFocusManagerEvent event)
		{
			String currentState = fsm.currentState.name;
			switch(event.type)
			{
				case CursorFocusManagerEvent.MOVE_RIGHT:
					if(currentState == 'main')
					{
						fsm.changeState('defense');
					}
					else if(currentState == 'row')
					{
						fsm.changeState('main');
					}
					break;

				case CursorFocusManagerEvent.MOVE_LEFT:
					if(currentState == 'defense')
					{
						fsm.changeState('main');
					}
					else if(currentState == 'main')
					{
						fsm.changeState('row');
					}
					break;

				case CursorFocusManagerEvent.SELECTED:
					String selectedItem;
					switch(currentState)
					{
						case "main":
							selectedItem = mainMenuItems[cursorManager.selectedIndex].name;
							break;

						case "defense":
							selectedItem = defendMenuItems[cursorManager.selectedIndex].name;
							break;

						case "row":
							selectedItem = rowMenuItems[cursorManager.selectedIndex].name;
							break;
					}
					fsm.changeState('hide');
					_controller.add(new BattleMenuEvent(BattleMenuEvent.ITEM_SELECTED, selectedItem));
					break;
			}
		});
	}

	void show()
	{
		fsm.changeState("main");
	}

	void hide()
	{
		fsm.changeState("hide");
	}


}