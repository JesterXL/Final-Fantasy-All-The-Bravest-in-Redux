// import PIXI from "pixi.js";
// import _ from "lodash";
// import "gsap";
// import "howler";
import { Subject } from 'rx';
import BattleTimerBar from './BattleTimerBar';
import { ATTACK_CHOOSE_TARGET, CHOOSE_ITEM_TARGET } from '../reducers/playerstate';

export default class CharacterSprite extends PIXI.Container
{
    get changes()
    {
        return this._changes;
    }

	constructor(image, entity, showBattleTimerBar, store, x, y)
	{
        super();
        const me = this;
		me.entity = entity;
        me.store = store;
        me.x = x;
        me.y = y;
        me._changes = new Subject();
        
        me.sprite = new PIXI.Sprite.fromImage(image);
        me.addChild(me.sprite);

        if(showBattleTimerBar)
        {
            me.battleTimerBar = new BattleTimerBar(30, 10);
            me.addChild(me.battleTimerBar);
            me.battleTimerBar.x = me.width / 2 - me.battleTimerBar.width / 2;
            me.battleTimerBar.y -= me.battleTimerBar.height;

            me.store.subscribe(()=>
            {
                const state = store.getState();
                const character = _.find(state.characters, character => character.entity === me.entity);
                const battleTimer = _.find(state.battleTimers, battleTimer => battleTimer.characterEntity === me.entity);
                me.setPercentage(battleTimer.percentage);
            });
        }

        let readyToBeCickedOn = false;
        me.storeSub = me.store.subscribe(()=>
        {
            const state = store.getState();
            if(readyToBeCickedOn === false && state.playerState === ATTACK_CHOOSE_TARGET || state.playerState === CHOOSE_ITEM_TARGET)
            {
                readyToBeCickedOn = true;
                me.interactive = me.buttonMode = true;
                me.on('pointerdown', me.clickEvent);
            }
            else if(readyToBeCickedOn === true && state.playerState !== ATTACK_CHOOSE_TARGET || state.playerState === CHOOSE_ITEM_TARGET)
            {
                readyToBeCickedOn = false;
                me.interactive = me.buttonMode = true;
                me.off('pointerdown', me.clickEvent);
            }
        });
	}

    clickEvent(event)
    {
        const me = this;
        me._changes.onNext({
            type: 'click',
            entity: me.entity,
            sprite: me
        });
    }

    destroy()
    {
        if(me.storeSub)
        {
            me.storeSub.dispose();
        }
    }

	setPercentage(value)
	{
        const me = this;
		me.battleTimerBar.percentage = value;
		me.battleTimerBar.render();
	}

    leapTowardsTarget(targetX, targetY)
	{
		const me = this;
		return new Promise( success =>
		{
            if(me.battleTimerBar)
            {
			    me.battleTimerBar.visible = false;
            }
			const startWX = me.x;
			const startWY = me.y;
			// welcome kids to lessons in not paying attention in math class
			const dist = Math.sqrt(Math.pow(targetX - startWX, 2) + Math.pow(targetY - startWY, 2));
			const half = dist / 2;
			const halfX = Math.abs(targetX - startWX);
			const halfY = Math.abs(targetY - startWY);
			let middleY = Math.min(startWY, targetY);
			middleY /= 2;
			middleY = -middleY;
			const middleX = halfX;

			TweenMax.to(me, 0.7, {
				bezier: {
					type: 'thru',
					values: [
				{ x: startWX, y: startWY}, 
				{x: middleX, y: middleY},
				{ x: targetX, y: targetY}
			],
					curviness: 2
				},
				ease: Linear.easeInOut,
				onComplete: success
			});
		});
	}

    leapBackToStartingPosition(startX, startY, middleX, middleY)
	{
		// console.log("leapBackToStartingPosition, startX: " + startX + ", startY: " + startY + ", middleX: " + middleX + ", middleY: " + middleY);
		const me = this;
		return new Promise( success =>
		{
			// console.log("mySprite x: " + mySprite.x + ", y:" + mySprite.y);
			const tl = new TimelineMax();
			tl.add( TweenMax.to(me, 0.7, {
				bezier: {
					type: 'thru',
					values: [
						{ x: me.x, y: me.y},
						{ x: middleX, y: middleY},
						{ x: startX, y: startY}
					],
					curviness: 2
				},
				ease: Linear.easeInOut, onStart: ()=>
			{
				// me.raise();
				// me.faceRight();
			},
			onComplete: ()=>
			{
				// me.stand();
				// me.faceLeft();
				me.battleTimerBar.visible = true;
				success();
			}}));
		});
	}
}