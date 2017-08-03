// import {expect, assert, should } from 'chai';
// should();
// import _ from 'lodash';
// import { 
// 	getCharacter,
//     makePlayer,
//     makeReadyCharacter,
//     equippedWithNoRelics,
//     equippedWithGauntlet,
//     rightHandHasWeapon,
//     leftHandHasWeapon,
//     rightHandHasNoWeapon,
//     leftHandHasNoWeapon,
//     hasZeroWeapons
// } from './Character';
// import {
//     getAtlasArmletRelic,
//     getGauntletRelic
// } from '../relics';
// import BattleState from '../enums/BattleState';
// const log = console.log;
// const getOnePlayer = _.partial(makePlayer, '1');

// describe('#Character', ()=>
// {
//     it('#getCharacter', ()=>
//     {
//         getCharacter('1').should.exist;
//     });
//     it('#makePlayer where entity matches', ()=>
//     {
//         const player = getOnePlayer();
//         player.entity.should.equal('1');
//     });
//     describe('#battle state', ()=>
//     {
//         it('default character is not ready', ()=>
//         {
//             const player = getOnePlayer();
//             player.battleState.should.not.equal(BattleState.READY);
//         });
//         it("if you make 'em ready, they ready", ()=>
//         {
//             const player = makeReadyCharacter('1');
//             player.battleState.should.equal(BattleState.READY);
//         });
//     });
//     describe('#equippedWithNoRelics', ()=>
//     {
//         it('true by default', ()=>
//         {
//             const player = getOnePlayer();
//             equippedWithNoRelics(player).should.be.true;
//         });
//         it('false once you equip one', ()=>
//         {
//             const player = getOnePlayer();
//             const relic = getAtlasArmletRelic();
//             player.relic1 = relic; 
//             equippedWithNoRelics(player).should.be.false;
//         });
//     });
//     describe('#equippedWithGauntlet', ()=>
//     {
//         it('works with real gauntlet', ()=>
//         {
//             const player = getOnePlayer();
//             const relic = getGauntletRelic();
//             player.relic1 = relic; 
//             equippedWithGauntlet(player).should.be.true;
//         });
//         it('false by default', ()=>
//         {
//             const player = getOnePlayer();
//             equippedWithGauntlet(player).should.be.false;
//         });
//         it('false if different relic', ()=>
//         {
//             const player = getOnePlayer();
//             const relic = getAtlasArmletRelic();
//             player.relic1 = relic; 
//             equippedWithGauntlet(player).should.be.false;
//         });
//     });
//     describe("#weapons", ()=>
//     {
//         describe("#rightHandHasWeapon", ()=>
//         {
//             it('should return false with nothing', ()=>
//             {
//                 rightHandHasWeapon().should.be.false;
//             });
//             it('should return true with nothing', ()=>
//             {
//                 rightHandHasWeapon({rightHand: {}}).should.be.true;
//             });
//         });
//         describe("#leftHandHasWeapon", ()=>
//         {
//             it('should return false with nothing', ()=>
//             {
//                 leftHandHasWeapon().should.be.false;
//             });
//             it('should return true with nothing', ()=>
//             {
//                 leftHandHasWeapon({leftHand: {}}).should.be.true;
//             });
//         });
//         describe("#rightHandHasNoWeapon", ()=>
//         {
//             it('should return true with nothing', ()=>
//             {
//                 rightHandHasNoWeapon().should.be.true;
//             });
//             it('should return true with empty', ()=>
//             {
//                 rightHandHasNoWeapon({}).should.be.true;
//             });
//             it('should return false with weapon', ()=>
//             {
//                 rightHandHasNoWeapon({rightHand: {}}).should.be.false;
//             });
//         });
//         describe("#leftHandHasNoWeapon", ()=>
//         {
//             it('should return true with nothing', ()=>
//             {
//                 leftHandHasNoWeapon().should.be.true;
//             });
//             it('should return true with empty', ()=>
//             {
//                 leftHandHasNoWeapon({}).should.be.true;
//             });
//             it('should return false with weapon', ()=>
//             {
//                 leftHandHasNoWeapon({leftHand: {}}).should.be.false;
//             });
//         });
//         describe("#hasZeroWeapons", ()=>
//         {
//             it('should return true with nothing', ()=>
//             {
//                 hasZeroWeapons().should.be.true;
//             });
//             it('should return true with no weapons', ()=>
//             {
//                 hasZeroWeapons({}).should.be.true;
//             });
//             it('should return false with left weapon', ()=>
//             {
//                 hasZeroWeapons({leftHand: {}}).should.be.false;
//             });
//             it('should return false with right weapon', ()=>
//             {
//                 hasZeroWeapons({rightHand: {}}).should.be.false;
//             });
//             it('should return false with right and left weapon', ()=>
//             {
//                 hasZeroWeapons({rightHand: {}, leftHand: {}}).should.be.false;
//             });
//         });
//     });
// });