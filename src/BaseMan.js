class BaseMan
{
	constructor(speed)
	{
		this.speed = speed;
	}

	equipped()
	{
		return this.speed;
	}
}

export default BaseMan;