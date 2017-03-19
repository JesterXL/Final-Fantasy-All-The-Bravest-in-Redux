class BattleTimerBar extends PIXI.Container
{
	static get ROUND(){ return 1};

	get percentage()
	{
		return this._percentage;
	}

	set percentage(value)
	{
        const me = this;
		if(value === null)
		{
			value = 0;
		}

		if(me._percentage === value)
		{
			return;
		}
		value = _.clamp(value, 0, 1);
		me._percentage = value;
		me.percentageDirty = true;
		if(value === 1)
		{
			me.setState('ready');
		}
		else
		{
			me.setState('loading');
		}
	}

	constructor(width=30, height=6)
	{
        super();

        const me = this;
		me._width = width;
		me._height = height;
		me._percentage = 1;
		me.percentageDirty = false;
		me.flashDirty = false;

		me.graphics = new PIXI.Graphics();
		me.addChild(me.graphics);

        me.setState('idle');

		me.redraw();
	}

    setState(newState)
    {
        const me = this;
        const oldState = me.state;
        me.state = newState;
        switch(newState)
        {
            case 'readyWhite': me.flashDirty = true;
            case 'readyGold': me.flashDirty = true;
            case 'idle': me.visible = true;
            case 'ready':
            case 'loading':
            default:
                return;
        }
    }

	redraw()
	{
        const me = this;
		const OFFSET = 2;

		me.graphics.beginFill(0xFFFFFF);
		me.graphics.drawRect(0, 
							0, 
							me._width, 
							me._height);

		me.graphics.beginFill(0x000080);
		me.graphics.drawRect(1, 
									1, 
									me._width - 2, 
									me._height - 2, 
									BattleTimerBar.ROUND);
		
		
		let percentageWidth = me._width * me._percentage - OFFSET * 2;
		percentageWidth = _.clamp(percentageWidth, 0, me._width);
		me.graphics.beginFill(0xffd700);
		me.graphics.drawRect(OFFSET, 
			OFFSET,
			percentageWidth, 
			me._height - OFFSET * 2);
	}

	render()
	{
        const me = this;
		if(me.percentageDirty || me.flashDirty)
		{
			me.graphics.clear();
		}

		if(me.percentageDirty)
		{
			me.percentageDirty = false;
			me.redraw();
		}
	}
}

export default BattleTimerBar