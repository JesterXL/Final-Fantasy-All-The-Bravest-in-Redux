import { poisonDamage } from '../battle/StatusEffectHandlers';

export function PoisonStatusEffectComponent(entity)
{
	return {
		entity,
		poisonDamage
	};
}