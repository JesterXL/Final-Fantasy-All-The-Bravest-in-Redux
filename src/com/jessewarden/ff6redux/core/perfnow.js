var performance = {
	// TODO: memoize
	now: function()
	{
		if(global.window && global.window.performance && global.window.performance.now)
		{
			return global.window.performance.now();
		}
		else
		{
			return oldschool();
		}
	}
};

function oldschool()
{
	return Date.now();
}

export default performance;