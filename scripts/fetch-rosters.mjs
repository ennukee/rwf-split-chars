import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GUILDS = [
  { region: 'us', realm: 'illidan', name: 'Liquid' },
  { region: 'eu', realm: 'tarren-mill', name: 'Echo' },
  { region: 'eu', realm: 'twisting-nether', name: 'Method' },
];

async function fetchGuildRoster(region, realm, guild) {
  const apiUrl = new URL('https://raider.io/api/guilds/roster');
  apiUrl.searchParams.append('region', region);
  apiUrl.searchParams.append('realm', realm);
  apiUrl.searchParams.append('guild', guild);

  const response = await fetch(apiUrl.toString());

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${guild}: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.guildRoster.roster;
}

async function fetchAllRosters() {
  console.log('Fetching guild rosters...');
  
  const rosters = {};
  
  for (const guild of GUILDS) {
    try {
      console.log(`Fetching ${guild.name} (${guild.region}/${guild.realm})...`);
      const allCharacters = await fetchGuildRoster(guild.region, guild.realm, guild.name);
      
      // Filter to only level 90 characters with ilvl 254+
      const roster = allCharacters.filter(char => char.character.level === 90 && char.character.itemLevelEquipped >= 254);
      
      const key = `${guild.region}/${guild.realm}/${guild.name}`;
      rosters[key] = {
        guild,
        roster,
        fetchedAt: new Date().toISOString(),
      };
      console.log(`✓ Fetched ${roster.length} level 90 characters for ${guild.name} (${allCharacters.length} total)`);
    } catch (error) {
      console.error(`✗ Error fetching ${guild.name}:`, error.message);
      process.exit(1);
    }
  }

  // Ensure public/data directory exists
  const dataDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write rosters to file
  const outputPath = path.join(dataDir, 'rosters.json');
  fs.writeFileSync(outputPath, JSON.stringify(rosters, null, 2));
  console.log(`\n✓ Saved rosters to ${outputPath}`);
}

fetchAllRosters();
