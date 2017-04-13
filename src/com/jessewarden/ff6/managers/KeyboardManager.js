import { Subject } from 'rx';

export default class KeyboardManager
{
	get changes()
	{
		return this._changes;
	}

	constructor()
	{
		var vm = this;
		vm._changes = new Subject();
		vm._eventListener = event => vm._changes.onNext(event);
		window.addEventListener("keydown", vm._eventListener, false);
	}

	destroy()
	{
		window.removeEventListener("keydown", this._eventListener);
	}
}