import {Subject} from 'rx';

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
		vm._eventListener = this.changePropagatorAlligator.bind(this);
		window.addEventListener("keydown", vm._eventListener, false);
		// window.addEventListener("focus", e => vm._changes.onNext(e), false);
		// window.addEventListener("blur", e => vm._changes.onNext(e), false);

	}

	changePropagatorAlligator(e)
	{
		this.changes.onNext(e);
	}

	destroy()
	{
		window.removeEventListener("keydown", this._eventListener);
	}
}