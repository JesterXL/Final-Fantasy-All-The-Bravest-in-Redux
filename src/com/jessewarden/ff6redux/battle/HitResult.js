class HitResult
{
	get hit()
	{
		return this._hit;
	}

	get removeImageStatus()
	{
		return this._removeImageStatus;
	}
	
	HitResult(hit, removeImageStatus = false)
	{
		this._hit = hit;
		this._removeImageStatus = removeImageStatus;
	}
}

export default HitResult