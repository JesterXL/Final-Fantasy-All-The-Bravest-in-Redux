import {Subject} from "rx";
import _ from "lodash";
import StateMachine from '../core/StateMachine';

class Initiative
{
	// Stream<GameLoopEvent> _gameLoopStream;
	// ObservableList<Player> _players;
	// ObservableList<Monster> _monsters;
	// List<TimerCharacterMap> _battleTimers = new List<TimerCharacterMap>();
	// StreamController _streamController;

	// ObservableList<Player> get players => _players;
	// ObservableList<Monster> get monsters => _monsters;
	// StreamSubscription<BattleTimerEvent> timerSubscription;
	// Stream stream;

	// StateMachine _stateMachine;
	// StreamController _timerStreamController;
	// Stream _timerStream;

	Initiative(gameLoopStream, players, monsters)
	{
		this.subject = new Subject();
		this.timerSubject = new Subject();
		this.battleTimers = [];
		
		this.gameLoopStream = gameLoopStream;
		this.players = players;
		this.monsters = monsters;

		this.participants = [];
		this.participants.push(players);
		this.participants.push(monsters);
		_.forEach(participants, (list)=>
		{
			// listen for new changes
			list.changes.subscribe((event)=>
			{
				addOrremoveBattleTimerForPlayer(event, list);
			});

			// configure the participants in the battle we have now
			_.forEach(list, addBattleTimerForCharacter);
		});

		var me = this;
		this.timerSub = this.timerSubject.subscribe((event)=>
		{
			// print("Initaitive::timerStream listen, event: ${event.type}");
			switch(event.type)
			{
				case "pause":
					me.stateMachine.changeState("paused");
					break;

				case "start":
					me.stateMachine.changeState("waiting");
					break;

				case "resetTimerForCharacter":
					me.enableAndResetTimerForCharacter(event.character);
					break;
			}
		});
		var me = this;
		this.stateMachine = new StateMachine();
		this.stateMachine.addState(
			"waiting",
			undefined,
			()=>
			{
				me.timerSub.resume();
			},
			()=>
			{
				me.timerSub.pause();
			}
		);

		// NOTE: the timerSub is actuall a battletimer... we need to rethink this, it's hard
		_stateMachine.addState(
			"paused",
			undefined,
			()=>
			{
				_pause();
				timerSubscription.pause();
			},
			()=>
			{
				_start();
				timerSubscription.resume();
			});
		_stateMachine.changes.listen((StateMachineEvent event)
		{
			print("Initiative state change: ${_stateMachine.currentState.name}");
		});
		_stateMachine.initialState = 'waiting';

		_streamController.add(new InitiativeEvent(InitiativeEvent.INITIALIZED));
	}

	void _enableAndResetTimerForCharacter(Character character)
	{
		TimerCharacterMap matched = _battleTimers.firstWhere((TimerCharacterMap map)
		{
			return map.character == character;
		});
		if(character.dead == false)
		{
			matched.battleTimer.enabled = true;
			matched.battleTimer.reset();
			if(_stateMachine.currentState.name == "waiting")
			{
				matched.battleTimer.start();
			}
		}
	}

	void resetCharacterTimer(Character character)
	{
		_timerStreamController.add(new TimerEvent(type: TimerEvent.RESET_TIMER_FOR_CHARACTER, character: character));
	}

	void addBattleTimerForCharacter(Character character)
	{
		String mode = getModeBasedOnType(character);
		BattleTimer timer = new BattleTimer(_gameLoopStream, mode);
		timerSubscription = timer.stream
		.listen((BattleTimerEvent event)
		{
			TimerCharacterMap matched = _battleTimers.firstWhere((TimerCharacterMap map)
			{
				return map.battleTimer == event.target;
			});
			if(event.type == BattleTimerEvent.COMPLETE)
			{
				matched.battleTimer.enabled = false;
				Character targetCharacter = matched.character;
				if(targetCharacter is Player)
				{
					_streamController.add(new InitiativeEvent(InitiativeEvent.PLAYER_READY,
					character: targetCharacter));
				}
				else
				{
					_streamController.add(new InitiativeEvent(InitiativeEvent.MONSTER_READY,
					character: targetCharacter));
				}
			}
			else if(event.type == BattleTimerEvent.PROGRESS)
			{
				event.character = matched.character;
				_streamController.add(event);
			}
		});

		timer.speed = character.speed;

		if(character is Player)
		{
			StreamSubscription<CharacterEvent> characterSubscription = character.stream.listen((CharacterEvent event)
			{
				if(event.type == CharacterEvent.NO_LONGER_SWOON)
				{
					// TODO: ensure we're not in a paused state
					timer.enabled = true;
					timer.reset();
					timer.start();
				}

				if(event.target.hitPoints <= 0)
				{
					timer.enabled = false;
				}

				if(event.type == CharacterEvent.SWOON)
				{
					onDeath(event);
				}
			});
			_battleTimers.add(new TimerCharacterMap(timer, timerSubscription, character, characterSubscription));
		}
		else
		{
			StreamSubscription<CharacterEvent> characterSubscription = character.stream
			.where((CharacterEvent event)
			{
				return event.type == CharacterEvent.SWOON;
			})
			.listen((CharacterEvent event)
			{
				timer.enabled = false;
				removeBattleTimerForPlayer(event.target);
				onDeath(event);
			});
			_battleTimers.add(new TimerCharacterMap(timer, timerSubscription, character, characterSubscription));
		}

		timer.start();
	}

	String getModeBasedOnType(Character character)
	{
		if(character is Player)
		{
			return BattleTimer.MODE_PLAYER;
		}
		else
		{
			return BattleTimer.MODE_MONSTER;
		}
	}

	void removeBattleTimerForPlayer(Character character)
	{
		TimerCharacterMap object = _battleTimers.firstWhere((object)
		{
			return object.character == character;
		});
		object.battleTimer.dispose();
		object.battleTimerSubscription.cancel();
		object.characterSubscription.cancel();
		_battleTimers.remove(object);
	}

	void addOrremoveBattleTimerForPlayer(List<ListChangeRecord> records, ObservableList<Character> list)
	{
		// data: [#<ListChangeRecord index: 0, removed: [], addedCount: 2>]
		records.forEach((ListChangeRecord record)
		{
			if(record.addedCount > 0)
			{
				for(int index = record.index; index < record.index + record.addedCount; index++)
				{
					addBattleTimerForCharacter(list.elementAt(index));
				}
			}
			if(record.removed.length > 0)
			{
				record.removed.forEach(addBattleTimerForCharacter);
			}
		});
	}

	void _pause()
	{
		_battleTimers.forEach((TimerCharacterMap timerCharacterMap)
		{
			timerCharacterMap.pause();
		});
	}

	void pause()
	{
		_timerStreamController.add(new TimerEvent(type: TimerEvent.PAUSE));
	}

	void _start()
	{
		_battleTimers.forEach((TimerCharacterMap timerCharacterMap)
		{
			timerCharacterMap.resume();
		});
	}

	void start()
	{
		_stateMachine.changeState("waiting");
		_timerStreamController.add(new TimerEvent(type: TimerEvent.START));
	}

	void onDeath(Character character)
	{
		bool allMonstersDead = monsters.every((Monster monster)
		{
			return monster.dead;
		});

		bool allPlayersDead = players.every((Player player)
		{
			return player.dead;
		});

		// TODO: handle Life 3
		if(allPlayersDead)
		{
			pause();
			_streamController.add(new InitiativeEvent(InitiativeEvent.LOST));
			return;
		}

		if(allMonstersDead)
		{
			pause();
			_streamController.add(new InitiativeEvent(InitiativeEvent.WON));
			return;
		}
	}
}

class TimerCharacterMap
{
	BattleTimer battleTimer;
	StreamSubscription battleTimerSubscription;
	Character character;
	StreamSubscription characterSubscription;

	TimerCharacterMap(this.battleTimer, this.battleTimerSubscription, this.character, this.characterSubscription)
	{
	}

	void pause()
	{
		battleTimer.pause();
		battleTimerSubscription.pause();
		characterSubscription.pause();
	}

	void resume()
	{
		battleTimer.start();
		battleTimerSubscription.resume();
		characterSubscription.resume();
	}

}

class TimerEvent
{
	String type;
	Character character;
	BattleTimer timer;

	static const String PAUSE = "pause";
	static const String START = "start";
	static const String RESET_TIMER_FOR_CHARACTER = "reset";

	TimerEvent({String this.type, Character this.character})
	{
	}
}