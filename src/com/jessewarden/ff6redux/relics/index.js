// http://www.rpglegion.com/ff6/items/relics.htm
export const getRelic = (relicType) =>
{
    return {type: 'relic', relicType};
}

export const getAtlasArmletRelic = () => getRelic('Atlas Armlet');
export const getEarringRelic     = () => getRelic('Earring');
export const getGauntletRelic    = () => getRelic("Gauntlet");
export const getGenjiGloveRelic  = () => getRelic('Genji Glove');
export const getHeroRingRelic    = () => getRelic('Hero Ring');
export const getOfferingRelic    = () => getRelic('Offering');

