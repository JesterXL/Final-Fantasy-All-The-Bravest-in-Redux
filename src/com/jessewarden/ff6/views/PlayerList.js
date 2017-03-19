import BattleTimerBar from './BattleTimerBar';

export default class PlayerList extends PIXI.Container
{
	constructor(store, width=320, height=160)
	{
		super();
        const me = this;
		me._width = 320;
		me._height = 160;
		me.store = store;
        me.unsubscribe = me.store.subscribe(()=> me.onStoreChange());
		me.createChildren();
		me.onStoreChange();
	}

	createChildren()
	{
		const me = this;

		me._border = new PIXI.Graphics();
		me._border.beginFill(0x0000FF);
		me._border.lineStyle(4, 0xFFFFFF, 1);
		me._border.drawRoundedRect(0, 0, me._width, me._height, 6);
		me.addChild(me._border);

		me._characters = new PIXI.Container();
		me.addChild(me._characters);

		me._fieldPool = [];
		me._containerPool = [];
        me._barPool = [];
	}

	getTextField()
	{
		const me = this;
		if(me._fieldPool.length > 0)
		{
			return me._fieldPool.pop();
		}
		else
		{
			const style = new PIXI.TextStyle({
			    fontFamily: '36px Final Fantasy VI SNESa',
			    fill : '#FFFFFF',
			    stroke : '#000000',
			    strokeThickness : 2,
			    dropShadow : true,
			    dropShadowColor : '#000000',
			    dropShadowAngle : Math.PI / 6,
			    dropShadowDistance : 2,
			    wordWrap : false
			});
			const textField = new PIXI.Text('???');
            textField.style = style;
			return textField;
		}
	}

	getContainer()
	{
		const me = this;
		if(me._containerPool.length > 0)
		{
			return me._containerPool.pop();
		}
		else
		{
			return new PIXI.Sprite();
		}
	}

    getBattleTimerBar()
    {
        const me = this;
		if(me._barPool.length > 0)
		{
			return me._barPool.pop();
		}
		else
		{
			return new BattleTimerBar();
		}
    }

    onStoreChange()
    {
		const me = this;
        const state = me.store.getState();
        const spritesToRemove = me.getSpritesToRemove(me._characters.children, state.characters);
		if(spritesToRemove.length > 0)
		{
			_.forEach(spritesToRemove, sprite => sprite.parent.removeChild(sprite));
		}
		const charactersToAdd = me.getCharactersToAdd(state.characters, me._characters.children);
		if(charactersToAdd.length > 0)
		{
			me.addCharacters(charactersToAdd, me._characters);
		}
        me.redraw(state);
    }

    getCharactersToAdd(characters, children)
    {
        return _.differenceWith(characters, children, (character, sprite) =>
        {
            return character.entity === sprite.entity;
        });
    }

    getSpritesToRemove(children, characters)
    {
        return _.differenceWith(children, characters, (sprite, character) =>
        {
            return sprite.entity === character.entity;
        });
    }

    addCharacters(characters, parent)
    {
        const me = this;
        let startX = 4;
        let startY = 4;
        return _.chain(characters)
        .map(character =>
        {
            const holder = me.getContainer();
            // name, hitpoints, bar
            const nameField = me.getTextField();
            const hitPointsField = me.getTextField();
            const battleTimerBar = me.getBattleTimerBar();
            holder.addChild(nameField, hitPointsField, battleTimerBar);
            holder.entity = character.entity;
            parent.addChild(holder);
            holder.x = startX;
            holder.y = startY;
            hitPointsField.x = 100;
            battleTimerBar.x = 200;
            holder.updateCharacter = character =>
            {
                nameField.text = character.entity.substring(0, 5);
                hitPointsField.text = character.hitPoints;
            };
            holder.updateBar = percentage =>
            {
                battleTimerBar.percentage = percentage;
                battleTimerBar.render();
            };
            startY += 40;
            return holder;
        })
        .value();
    }

	redraw(state)
	{
		const me = this;
        _.forEach(me._characters.children, sprite =>
        {
            const character = _.find(state.characters, character => character.entity === sprite.entity);
            
			sprite.updateCharacter(character);
            const battleTimer = _.find(state.battleTimers, battleTimer => battleTimer.characterEntity === sprite.entity);
            sprite.updateBar(battleTimer.percentage);
        });
	}
}