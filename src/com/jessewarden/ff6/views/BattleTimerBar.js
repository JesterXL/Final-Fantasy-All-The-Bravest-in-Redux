class BattleTimerBar extends PIXI.Container
{
	static get ROUND(){ return 1};
	static get WIDTH(){ return 30};
	static get HEIGHT(){ return 6};

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

	constructor()
	{
        super();

        const me = this;

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
							BattleTimerBar.WIDTH, 
							BattleTimerBar.HEIGHT);

		me.graphics.beginFill(0x000080);
		me.graphics.drawRect(1, 
									1, 
									BattleTimerBar.WIDTH - 2, 
									BattleTimerBar.HEIGHT - 2, 
									BattleTimerBar.ROUND);
		
		
		let percentageWidth = BattleTimerBar.WIDTH * me._percentage - OFFSET * 2;
		percentageWidth = _.clamp(percentageWidth, 0, BattleTimerBar.WIDTH);
		me.graphics.beginFill(0xffd700);
		me.graphics.drawRect(OFFSET, 
			OFFSET,
			percentageWidth, 
			BattleTimerBar.HEIGHT - OFFSET * 2);
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