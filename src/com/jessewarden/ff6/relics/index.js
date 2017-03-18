// http://www.rpglegion.com/ff6/items/relics.htm

import _ from "lodash";

export const getRelic = (relicType) =>
{
    return {type: 'relic', relicType};
}

export const AtlasArmlet = 'Atlas Armlet';
export const Earring      = 'Earring';
export const Gauntlet     = 'Gauntlet';
export const GenjiGlove   = 'Genji Glove';
export const HeroRing     = 'Hero Ring';
export const Offering     = 'Offering';

export const getAtlasArmletRelic = () => getRelic(AtlasArmlet);
export const getEarringRelic     = () => getRelic(Earring);
export const getGauntletRelic    = () => getRelic(Gauntlet);
export const getGenjiGloveRelic  = () => getRelic(GenjiGlove);
export const getHeroRingRelic    = () => getRelic(HeroRing);
export const getOfferingRelic    = () => getRelic(Offering);

export const isRelic       = (o) => _.get(o, 'type') === 'relic';
export const isRelicType   = (type, relic) => _.get(relic, 'relicType') === type;

export const isAtlasArmlet = _.partial(isRelicType, AtlasArmlet);
export const isEarring     = _.partial(isRelicType, Earring);
export const isGauntlet    = _.partial(isRelicType, Gauntlet);
export const isGenjiGlove  = _.partial(isRelicType, GenjiGlove);
export const isHeroRing    = _.partial(isRelicType, HeroRing);
export const isOffering    = _.partial(isRelicType, Offering);
