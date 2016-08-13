import test from 'tape';
import {makeEntity} from './entity';

test('#basic test', (t)=>
{
	t.plan(1);
    t.equal(true, true);
});
test('#makeEntity', (t)=>
{
	t.plan(3);
	var entity = makeEntity('test');
	console.log("entity:", entity);
	t.ok(entity);
	t.ok(entity.id);
	t.ok(entity.name);
});