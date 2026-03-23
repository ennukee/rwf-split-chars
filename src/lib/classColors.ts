export const CLASS_COLORS: Record<string, string> = {
  'Warrior': '#C69B7B',      // Brown
  'Paladin': '#F58CBA',      // Pink
  'Hunter': '#ABD473',       // Green
  'Rogue': '#FFF569',        // Yellow
  'Priest': '#FFFFFF',       // White
  'Shaman': '#0070DD',       // Blue
  'Druid': '#FF8000',        // Orange
  'Warlock': '#9482CA',      // Purple
  'Monk': '#00FF96',         // Teal
  'Demon Hunter': '#A335EE', // Violet
  'Death Knight': '#C41E3A', // Crimson
  'Mage': '#69CCF0',         // Cyan
  'Evoker': '#33937F',       // Teal-green
};

// Maps spec bucket names (as used in analysis) to their class color
export const SPEC_COLORS: Record<string, string> = {
  // Tanks
  'Blood': '#C41E3A',           // Death Knight
  'Brewmaster': '#00FF96',      // Monk
  'Guardian': '#FF8000',        // Druid
  'Protection Paladin': '#F58CBA', // Paladin
  'Protection Warrior': '#C69B7B', // Warrior
  'Vengeance': '#A335EE',          // Demon Hunter
  // Healers
  'Holy': '#F58CBA',            // Paladin
  'Mistweaver': '#00FF96',      // Monk
  'Preservation': '#33937F',    // Evoker
  'Priest': '#FFFFFF',          // Priest
  'Restoration': '#0070DD',     // Shaman
  'Restoration Druid': '#FF8000', // Druid
};

export function getClassColor(className: string): string {
  return CLASS_COLORS[className] || '#94A3B8'; // Default slate gray
}

export function getSpecColor(specName: string): string {
  return SPEC_COLORS[specName] || CLASS_COLORS[specName] || '#94A3B8';
}
