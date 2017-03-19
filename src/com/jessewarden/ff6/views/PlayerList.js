import BattleTimerBar from './BattleTimerBar';

export default class PlayerList extends PIXI.Container
{
	constructor(store, width=140, height=80)
	{
		super();
        const me = this;
		me._width = width;
		me._height = height;
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
		me._border.lineStyle(2, 0xFFFFFF, 1);
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
			    fontFamily: 'Final Fantasy VI SNESa',
			    fill : '#FFFFFF',
			    stroke : '#000000',
			    strokeThickness : 2,
			    dropShadow : false,
			    dropShadowColor : '#000000',
			    dropShadowAngle : Math.PI / 6,
			    dropShadowDistance : 2,
			    wordWrap : false,
				fontSize: 18
			});
			const textField = new PIXI.Text('???');
            textField.style = style;
			return textField;

			// const bitmapText = new PIXI.extras.BitmapText("???", {font: "36px Final Fantasy VI SNESa"});
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
			return new BattleTimerBar(me._width / 4, 8);
		}
    }

	getPlayersFromCharaters(state)
	{
		return _.filter(state.characters, character => character.characterType === 'player');
	}

    onStoreChange()
    {
		const me = this;
        const state = me.store.getState();
		const players = me.getPlayersFromCharaters(state);
        const spritesToRemove = me.getSpritesToRemove(me._characters.children, players);
		if(spritesToRemove.length > 0)
		{
			_.forEach(spritesToRemove, sprite => sprite.parent.removeChild(sprite));
		}
		const charactersToAdd = me.getCharactersToAdd(players, me._characters.children);
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
        let startY = 2;
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

			
            hitPointsField.x = me._width / 2 - 8;
            battleTimerBar.x = hitPointsField.x + hitPointsField.width + 12;
			battleTimerBar.y = 4;
            holder.updateCharacter = character =>
            {
                // nameField.text = character.entity.substring(0, 5);
				nameField.text = character.name;
                hitPointsField.text = character.hitPoints;
            };
            holder.updateBar = percentage =>
            {
                battleTimerBar.percentage = percentage;
                battleTimerBar.render();
            };
            startY += battleTimerBar.height + 6;
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