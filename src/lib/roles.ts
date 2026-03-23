export type CharacterRole = 'tank' | 'healer' | 'dps';

const warnedSpecs = new Set<string>();

const SPEC_TO_ROLE: Record<string, CharacterRole> = {
  // Warrior
  'Arms': 'dps',
  'Fury': 'dps',
  'Protection': 'tank',
  // Paladin
  'Holy': 'healer',
  'Retribution': 'dps',
  'Protection Paladin': 'tank',
  // Hunter
  'Beast Mastery': 'dps',
  'Marksmanship': 'dps',
  'Survival': 'dps',
  // Rogue
  'Assassination': 'dps',
  'Outlaw': 'dps',
  'Subtlety': 'dps',
  // Priest
  'Discipline': 'healer',
  'Holy Priest': 'healer',
  'Shadow': 'dps',
  // Shaman
  'Elemental': 'dps',
  'Enhancement': 'dps',
  'Restoration': 'healer',
  // Druid
  'Balance': 'dps',
  'Feral': 'dps',
  'Guardian': 'tank',
  'Restoration Druid': 'healer',
  // Warlock
  'Affliction': 'dps',
  'Demonology': 'dps',
  'Destruction': 'dps',
  // Monk
  'Brewmaster': 'tank',
  'Windwalker': 'dps',
  'Mistweaver': 'healer',
  // Demon Hunter
  'Havoc': 'dps',
  'Devourer': 'dps',
  'Vengeance': 'tank',
  // Death Knight
  'Blood': 'tank',
  'Frost': 'dps',
  'Unholy': 'dps',
  // Mage
  'Arcane': 'dps',
  'Fire': 'dps',
  'Frost Mage': 'dps',
  // Evoker
  'Augmentation': 'dps',
  'Devastation': 'dps',
  'Preservation': 'healer',
};

export function getRole(spec: string): CharacterRole {
  // Try exact match first
  if (SPEC_TO_ROLE[spec]) {
    return SPEC_TO_ROLE[spec];
  }

  // Try case-insensitive match
  const lowerSpec = spec.toLowerCase();
  for (const [key, value] of Object.entries(SPEC_TO_ROLE)) {
    if (key.toLowerCase() === lowerSpec) {
      return value;
    }
  }

  // Heuristic fallback for variant/renamed specs
  if (
    lowerSpec.includes('protection') ||
    lowerSpec.includes('blood') ||
    lowerSpec.includes('guardian') ||
    lowerSpec.includes('brewmaster') ||
    lowerSpec.includes('vengeance')
  ) {
    return 'tank';
  }

  if (
    lowerSpec.includes('holy') ||
    lowerSpec.includes('restoration') ||
    lowerSpec.includes('discipline') ||
    lowerSpec.includes('mistweaver') ||
    lowerSpec.includes('preservation')
  ) {
    return 'healer';
  }

  // Default to DPS if unknown
  if (!warnedSpecs.has(spec)) {
    warnedSpecs.add(spec);
    console.warn(`Unknown spec: ${spec}, defaulting to DPS`);
  }
  return 'dps';
}
