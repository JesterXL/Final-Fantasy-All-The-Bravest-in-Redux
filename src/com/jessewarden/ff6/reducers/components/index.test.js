import {expect, assert, should } from 'chai';
should();
const log = console.log;
const _ = require('lodash');
import { addComponent } from './index';

describe("#components", ()=>
{
    describe("#addComponent", ()=>
    {
        it('should add correctly', ()=>
        {
            const mock = [];
            const result = addEntity(mock, {entity: '1'});
            _.first(result).should.equal('1');
        });
    });
});