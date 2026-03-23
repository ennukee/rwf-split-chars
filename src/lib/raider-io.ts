export type GuildRosterCharacter = {
  character: {
    name: string;
    level: number;
    itemLevelEquipped: number;
    class: {
      name: string;
    };
    spec: {
      name: string;
    };
  };
};

export type GuildRosterResponse = {
  guildRoster: {
    roster: GuildRosterCharacter[];
  };
};

export function parseRaiderIOUrl(url: string): {
  region: string;
  realm: string;
  guild: string;
} | null {
  const urlRegex =
    /https:\/\/raider\.io\/guilds\/([a-z-]+)\/([a-z-]+)\/([A-Za-z0-9-]+)/i;
  const match = url.match(urlRegex);

  if (!match) {
    return null;
  }

  return {
    region: match[1],
    realm: match[2],
    guild: match[3],
  };
}

export async function fetchGuildRoster(
  region: string,
  realm: string,
  guild: string
): Promise<GuildRosterCharacter[]> {
  const apiUrl = new URL("/api/guilds/roster", window.location.origin);
  apiUrl.searchParams.append("region", region);
  apiUrl.searchParams.append("realm", realm);
  apiUrl.searchParams.append("guild", guild);

  const response = await fetch(apiUrl.toString());

  if (!response.ok) {
    throw new Error(
      `Failed to fetch guild roster: ${response.status} ${response.statusText}`
    );
  }

  const data: GuildRosterResponse = await response.json();
  return data.guildRoster.roster;
}
