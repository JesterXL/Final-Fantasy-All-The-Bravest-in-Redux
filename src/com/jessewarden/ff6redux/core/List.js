import {Subject} from "rx";
import _ from "lodash";

function List(intialValues)
{
	var _list = [];
	var subject = new Rx.Subject();

	function add()
	{
		var args = _.toArray(arguments);
		_.forEach(args, (i)=>
		{
			_list.push(i);
			subject.onNext({type: "add", index: _list.length - 1, item: i});
		});
		return _list;
	}

	function addAt(index, item)
	{
		_list.splice(index, 0, item);
		subject.onNext({type: "addAt", index: index, item: item});
		return _list;
	}

	function remove()
	{
		var args = _.toArray(arguments);
		_.forEach(args, (item)=>
		{
			if(_.includes(_list, item))
			{
				var index = _list.indexOf(item);
				_list.splice(item, 1);
				subject.onNext({type: "remove", index: index, item: item});
			}
		});
		return _list;
	}

	function removeAt(index)
	{
		var item = _list[index];
		_list.splice(index, 1);
		subject.onNext({type: "removeAt", index: index, item: item});
		return _list;
	}

	function removeAll()
	{
		_list.length = 0;
		subject.onNext({type: "removeAll"});
		return _list;
	}

	var me = this;
	add(intialValues);

	return {
		add: add,
		addAt: addAt,
		remove: remove,
		removeAt: removeAt,
		removeAll: removeAll,
		get changes()
		{
			return subject;
		}
	};
}

export default List