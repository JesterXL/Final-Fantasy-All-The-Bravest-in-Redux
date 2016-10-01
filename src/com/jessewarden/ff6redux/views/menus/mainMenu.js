import PIXI from "pixi.js";
import _ from "lodash";
import "gsap";
import {Subject} from 'rx';

import Menu from '../Menu';

import CursorManager from '../managers/CursorManager';
import KeyboardManager from '../managers/KeyboardManager';
import StateMachine from '../core/StateMachine';

export function mainMenu(entity)
{
	var vm = this;
	vm.menu = new Menu();
}