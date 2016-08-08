
class TargetHitResult
{
	get hit() { return this._hit;}
	get target(){ return this._target;}
	get damage(){ return this._damage;}
	get criticalHit(){ return this._criticalHit;}
	get removeImageStatus(){ return this._removeImageStatus;}

	constructor(
	                hit,
	                target,
	                damage,
	                criticalHit,
	                removeImageStatus
	                )
	{
		this._hit = hit;
		this._target = target;
		this._damage = damage;
		this._criticalHit = criticalHit;
		this._removeImageStatus = removeImageStatus;
	}
}

export default TargetHitResult