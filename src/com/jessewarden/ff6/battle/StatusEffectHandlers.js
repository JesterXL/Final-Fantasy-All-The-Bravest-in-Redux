import { getRandomNumberFromRange } from './BattleUtils';

export const getZombieInflictChange = () => getRandomNumberFromRange(1, 16);
export const didZombieInflictZombieStatus = () => getZombieInflictChange() === 1;
export const didZombieInflictPoisonStatus = () => getZombieInflictChange() === 1;

export const getPoisonMaxDamage = (characterMaxHitPoints, stamina) => (characterMaxHitPoints * stamina / 1024) + 2;
export const getPoisonDamageFromMaxDamage = (maxDamage) => maxDamage * getRandomNumberFromRange(244, 255) / 256;
export const getPoisonDamageWithPlayerModification = (damage, isPlayer=false) => {
	if(isPlayer)
	{
		return damage / 2;
	}
	else
	{
		return damage;
	}
}
export function *poisonDamage(characterMaxHitPoints, stamina, isPlayer=false)
{
	var maxDamage = getPoisonMaxDamage(characterMaxHitPoints, stamina);
	if(maxDamage > 255)
	{
		maxDamage = 255;
	}
	var damage = getPoisonDamageFromMaxDamage(maxDamage);
	yield getPoisonDamageWithPlayerModification(damage, isPlayer);
	yield getPoisonDamageWithPlayerModification(getPoisonDamageFromMaxDamage(maxDamage) * 2, isPlayer);
	yield getPoisonDamageWithPlayerModification(getPoisonDamageFromMaxDamage(maxDamage) * 3, isPlayer);
	yield getPoisonDamageWithPlayerModification(getPoisonDamageFromMaxDamage(maxDamage) * 4, isPlayer);
	yield getPoisonDamageWithPlayerModification(getPoisonDamageFromMaxDamage(maxDamage) * 5, isPlayer);
	yield getPoisonDamageWithPlayerModification(getPoisonDamageFromMaxDamage(maxDamage) * 6, isPlayer);
	yield getPoisonDamageWithPlayerModification(getPoisonDamageFromMaxDamage(maxDamage) * 7, isPlayer);
	var lastDamage;
	while(true)
	{
		lastDamage = getPoisonDamageFromMaxDamage(maxDamage) * 8;
		if(lastDamage > (maxDamage * (255 / 256) * 8))
		{
			lastDamage = damage * 8;
		}
		yield getPoisonDamageWithPlayerModification(lastDamage, isPlayer);
	}
}; 