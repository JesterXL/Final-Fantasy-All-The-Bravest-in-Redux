import {expect, assert, should } from 'chai';
should();
const log = console.log;
const _ = require('lodash');
import { addEntity } from './index';

describe("#entities", ()=>
{
    it('basic test should work', ()=>
    {
        true.should.be.true;
    });
    describe("#addEntity", ()=>
    {
        it('should add correctly', ()=>
        {
            const mock = [];
            const result = addEntity(mock, {entity: '1'});
            _.first(result).should.equal('1');
        });
    });
});