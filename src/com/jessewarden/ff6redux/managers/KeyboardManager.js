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
		window.addEventListener("keydown", e => vm._changes.onNext(e), false);
		// window.addEventListener("focus", e => vm._changes.onNext(e), false);
		// window.addEventListener("blur", e => vm._changes.onNext(e), false);
		
	}
}