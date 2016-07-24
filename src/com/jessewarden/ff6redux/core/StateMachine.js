import _ from "lodash";
import {Subject} from "rx";

var notNil = _.negate(_.isNil);

class State
{
	get name()
	{
		return this._name;
	}
	get from()
	{
		this._from;
	}
	get enter()
	{
		return this._enter;
	}
	get exit()
	{
		return this._exit;
	}
	get parent()
	{
		return this._parent;
	}
	get changes()
	{
		return this._subject.asObservable();
	}
	
	set parent(parentState)
	{
		this._parent = parentState;
		this._subject.onNext({type: "parentChanged"});
		if(notNil(this._parent))
		{
			this._parent.children.push(this);
		}
	}
	
	get root()
	{
		var currentParentState = this.parent;
		if(notNil(currentParentState))
		{
			while(notNil(currentParentState.parent))
			{
				currentParentState = currentParentState.parent;
			}
		}
		return currentParentState;
	}
	
	get parents()
	{
		var currentParents = [];
		var currentParentState = parent;
		if(notNil(currentParentState))
		{
			currentParents.push(currentParentState);
			while(notNil(currentParentState))
			{
				currentParentState = currentParentState.parent;
				if(notNil(currentParentState))
				{
					currentParents.push(currentParentState);
				}
				else
				{
					break;
				}
			}
		}
		return currentParents;
	}
	
	isParentState(stateName)
	{
		var currentParents = this.parents;
		if(currentParents.length > 0)
		{
			currentParents.forEach((parentState)=>
			{
				if(parentState.name == stateName)
				{
					return true;
				}
			});
		}
		return false;
	}
	
	constructor(name, from = undefined, 
						enter = undefined, 
						exit = undefined, 
						parent = undefined)
	{
		this.children = [];
		this._name = name;
		// NOTE: We set it to * to ensure it's never null. * means "from anywhere"
		if(_.isNil(from))
		{
			this._from = [];
			this._from.push("*");
		}
		else
		{
			this._from = from;
		}
		this._enter = enter;
		this._exit = exit;
		if(!_.isNil(this.parent))
		{
			this._parent = parent;
			this._parent.children.push(this);
		}
	
		this._subject = new Subject();
	}
}

class StateMachine
{
	set initialState(startStateName)
	{
		var initial = this.states[startStateName];
		this._currentState = initial;
		var root = initial.root;
		if(!_.isNil(root))
		{
			this._currentParentStates = initial.parents;
			this._currentParentStates.forEach((parentState)=>
			{
				if(notNil(parentState.enter))
				{
					// TODO: make event class
					// local event = {name = "onEnterState", target = self, toState = stateName, entity = self.entity}
					//event.currentState = parentState.name;
					parentState.enter();
				}
			});
		}
		
		if(notNil(initial.enter))
		{
			// TODO: make event class
			initial.enter();
		}
		
		// TODO: dispatch transition complete... man... these should all be streams, eff me
		// local outEvent = {name = "onTransitionComplete", target = self, toState = stateName}
		
		// _streamController.add(new StateMachineEvent(StateMachineEvent.STATE_CHANGE));
		this.subject.onNext({type: "stateChange"});
	}
	
	get currentState()
	{
		return this._currentState;
	}
	set currentState(state)
	{
		// TODO: state change event?
		this._currentState = state;
	}

	get changes()
	{
		return this.subject.asObservable();
	}
	
	constructor()
	{
		this._currentState = undefined;
		this._currentParentState = undefined;
		this._currentParentStates = undefined;
		this.subject = new Subject();
		// was a Map, but... JavaScript
		this.states = {};
	}
	
	// NOTE: I'm aware the map is flat, and I don't support multiple states of the same name.
	// TODO: fix if you care, I don't. I believe Dart Map throws error if you attempt set
	// an already existing State.
	addState(stateName, from = undefined, 
						enter = undefined, 
						exit = undefined, 
						parent = undefined)
	{
		var parentState = undefined;
		if(notNil(parent))
		{
			parentState = this.states[parent];
		}
		var newState = new State(stateName,
									from,
									enter,
									exit,
									parentState);
		this.states[stateName] = newState;
		return newState;
	}
	
	canChangeStateTo(stateName)
	{
		//console.log("StateMachine::canChangeStateTo, stateName:", stateName);
		//console.log("states:", this.states);
		var targetToState = this.states[stateName];
		var score = 0;
		var win = 2;
		
		//console.log("stateName: " + stateName + ", current: " + this.currentState.name);
		if(stateName !== this.currentState.name)
		{
			score++;
		}
		
		// NOTE: Lua via State.inFrom was walking up one parent if from was null... why?
		//console.log("targetToState:", targetToState);
		if(notNil(targetToState.from))
		{
			if(targetToState.from.contains(this._currentState.name) === true)
			{
				//console.log("state is in from list");
				score++;
			}
			
			if(targetToState.from.contains("*") === true)
			{
				//console.log("has a star");
				score++;
			}
		}
		
		if(notNil(this.currentState) && notNil(this.currentState.parent))
		{
			if(this.currentState.parent.name === stateName)
			{
				score++;
			}
		}
		
		if(notNil(targetToState.from))
		{
			score++;
		}
		//console.log("StateMachine::canChangeStateTo, score:", score);
		if(score >= win)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	findPath(stateFrom, stateTo)
	{
		var fromState = this.states[stateFrom];
		var c = 0;
		var d = 0;
		var path = [];
		while(notNil(fromState))
		{
			d = 0;
			var toState = this.states[stateTo];
			while(notNil(toState))
			{
				if(fromState == toState)
				{
					path.push(c);
					path.push(d);
					return path;
				}
				d++;
				toState = toState.parent;
			}
			c++;
			fromState = fromState.parent;
		}
		path.push(c);
		path.push(d);
		return path;
	}

	changeState(stateName)
	{
		// Completer completer = new Completer();
		if(this.canChangeStateTo(stateName) == false)
		{
			//_streamController.add(new StateMachineEvent(StateMachineEvent.TRANSITION_DENIED));
			//completer.complete(false);
			//return completer.future;
			this.subject.onNext({type: "transitionDenied"});
		}
		
		var path = this.findPath(this._currentState.name, stateName);
		if(path[0] > 0)
		{
//			local exitCallback = {name = "onExitState",
//            									target = self,
//            									toState = stateTo,
//            									fromState = state}
			if(notNil(this._currentState.exit))
			{
				//exitCallback.currentCallback = _currentState;
				this._currentState.exit();
			}
			
			this._currentParentState = this._currentState;
			
			var p = 0;
			while(p < path[0])
			{
				this._currentParentState = this._currentParentState.parent;
				if(notNil(this._currentParentState) && notNil(this._currentParentState.exit))
				{
					// exitCallback.currentState = _currentParentState.parentState.name;
					this._currentParentState.exit();
				}
				p++;
			}
		}
		
		var toState = this.states[stateName];
		var oldState = this._currentState;
		this._currentState = toState;
		
		if(path[1] > 0)
		{
//			local enterCallback = {name = "onEnterState",
//            									target = self,
//            									toState = stateTo,
//            									fromState = oldState,
//            									entity = self.entity}
			
			if(notNil(toState.root))
			{
				this._currentParentStates = toState.parents;
				var secondPath = path[1];
				var k = secondPath - 1;
				while(k >= 0)
				{
					var theCurrentParentState = this._currentParentStates[k];
					if(notNil(theCurrentParentState) && notNil(theCurrentParentState.enter))
					{
						// enterCallback.currentState = theCurrentParentState.name;
						theCurrentParentState.enter();
					}
					k--;
				}
			}
			
			if(notNil(toState.enter))
			{
				// enterCallback.currentState = toState.name;
				toState.enter();
			}
		}
		
//		local outEvent = {name = "onTransitionComplete",
//        							target = self,
//        							fromState = oldState,
//        							toState = stateTo}
//        		self:dispatchEvent(outEvent)
		// _streamController.add(new StateMachineEvent(StateMachineEvent.TRANSITION_COMPLETE));
		// completer.complete(true);
		// return completer.future;
		this.subject.onNext({type: "transitionComplete"});
	}
	
}

export default StateMachine

