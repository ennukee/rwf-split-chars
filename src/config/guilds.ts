export const GUILDS = [
  { region: 'us', realm: 'illidan', name: 'Liquid' },
  { region: 'eu', realm: 'tarren-mill', name: 'Echo' },
  { region: 'eu', realm: 'twisting-nether', name: 'Method' },
] as const;

export type Guild = (typeof GUILDS)[number];
