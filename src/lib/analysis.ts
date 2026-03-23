import type { GuildRosterCharacter } from './raider-io'
import { getRole } from './roles'
import type { CharacterRole } from './roles'

export interface SpecStats {
  specName: string
  count: number
  avgIlvl: number
  topCharacters: Array<{
    name: string
    ilvl: number
  }>
}

export interface ClassStats {
  className: string
  count: number
  percentage: number
  avgIlvl: number
  maxIlvl: number
  minIlvl: number
  medianIlvl: number
  tanks: number
  healers: number
  dps: number
}

export interface CraftedClassStats {
  className: string
  craftedCount: number
  nonCraftedCount: number
  total: number
  craftedCharacters: string[]
  nonCraftedCharacters: string[]
}

export interface CraftedRoleStats {
  role: CharacterRole
  classStats: CraftedClassStats[]
}

export interface RoleStats {
  role: CharacterRole
  count: number
  percentage: number
  avgIlvl: number
  maxIlvl: number
  minIlvl: number
  medianIlvl: number
  specStats?: SpecStats[] // For tanks and healers: breakdown by spec
  classStats?: SpecStats[] // For DPS: breakdown by class
}

export function analyzeRoster(roster: GuildRosterCharacter[]): {
  classByStats: ClassStats[]
  craftedRoleStats: CraftedRoleStats[]
  roleStats: RoleStats[]
  totalCount: number
  overallAvgIlvl: number
  overallMaxIlvl: number
} {
  const roundToOneDecimal = (value: number): number => Math.round(value * 10) / 10

  const getMedian = (sortedValues: number[]): number => {
    const middle = Math.floor(sortedValues.length / 2)
    if (sortedValues.length % 2 === 0) {
      return roundToOneDecimal((sortedValues[middle - 1] + sortedValues[middle]) / 2)
    }
    return roundToOneDecimal(sortedValues[middle])
  }

  const removeBottomQuartile = (characters: GuildRosterCharacter[]): GuildRosterCharacter[] => {
    if (characters.length <= 1) {
      return characters
    }

    const sortedAsc = [...characters].sort(
      (a, b) => a.character.itemLevelEquipped - b.character.itemLevelEquipped
    )
    const cutoffCount = Math.floor(sortedAsc.length * 0.25)
    return sortedAsc.slice(cutoffCount)
  }

  const filteredRoster = removeBottomQuartile(roster)

  const craftedWeaponNames = new Set([
    "Aln'hara Cane",
    "Blood Knight's Impetus",
    "Aln'hara Pikestaff",
    "Aln'hara Sprigshot",
    "Magister's Valediction",
    "Blood Knight's Warblade",
    "Spellbreaker's Warglaive",
    'P.O.W. x3',
    'Bloodforged Claw',
    "Magister's Mana Sword",
    "Spellbreaker's Blade",
    "Farstrider's Mercy",
    "Farstrider's Chopper",
  ])

  const hasCraftedWeapon = (character: GuildRosterCharacter): boolean => {
    const equippedItems = character.character.items?.items
    const mainhandName = equippedItems?.mainhand?.name
    const offhandName = equippedItems?.offhand?.name

    const isCraftedWeaponName = (itemName: string | undefined): boolean => {
      if (!itemName) {
        return false
      }
      return craftedWeaponNames.has(itemName) || itemName.startsWith('World Tender')
    }

    return Boolean(
      isCraftedWeaponName(mainhandName) ||
      isCraftedWeaponName(offhandName)
    )
  }

  const getRoleBucketName = (character: GuildRosterCharacter, role: CharacterRole): string => {
    const className = character.character.class.name
    const specName = character.character.spec.name

    if (role === 'healer' && className === 'Priest') {
      const lowerSpec = specName.toLowerCase()
      if (lowerSpec.includes('discipline') || lowerSpec.includes('holy')) {
        return 'Priest'
      }
    }

    if (role === 'tank' && specName === 'Protection') {
      if (className === 'Warrior') {
        return 'Protection Warrior'
      }
      if (className === 'Paladin') {
        return 'Protection Paladin'
      }
    }

    return specName
  }

  const classMap = new Map<string, GuildRosterCharacter[]>()
  const craftedRoleClassMap = new Map<
    CharacterRole,
    Map<string, {
      craftedCount: number
      nonCraftedCount: number
      craftedCharacters: string[]
      nonCraftedCharacters: string[]
    }>
  >()
  const roleMap = new Map<CharacterRole, GuildRosterCharacter[]>()
  
  // Group by class, role, and spec
  for (const character of filteredRoster) {
    const className = character.character.class.name
    if (!classMap.has(className)) {
      classMap.set(className, [])
    }
    classMap.get(className)!.push(character)

    // Group by role
    const role = getRole(character.character.spec.name)
    if (!roleMap.has(role)) {
      roleMap.set(role, [])
    }
    roleMap.get(role)!.push(character)

    if (!craftedRoleClassMap.has(role)) {
      craftedRoleClassMap.set(role, new Map())
    }
    const roleClassMap = craftedRoleClassMap.get(role)!
    if (!roleClassMap.has(className)) {
      roleClassMap.set(className, {
        craftedCount: 0,
        nonCraftedCount: 0,
        craftedCharacters: [],
        nonCraftedCharacters: [],
      })
    }
    const classCrafted = roleClassMap.get(className)!
    if (hasCraftedWeapon(character)) {
      classCrafted.craftedCount += 1
      classCrafted.craftedCharacters.push(character.character.name)
    } else {
      classCrafted.nonCraftedCount += 1
      classCrafted.nonCraftedCharacters.push(character.character.name)
    }
    
  }

  // Calculate class stats
  const classByStats: ClassStats[] = []
  for (const [className, characters] of classMap.entries()) {
    const ilvls = characters.map(c => c.character.itemLevelEquipped).sort((a, b) => a - b)
    const tanks = characters.filter(c => getRole(c.character.spec.name) === 'tank').length
    const healers = characters.filter(c => getRole(c.character.spec.name) === 'healer').length

    classByStats.push({
      className,
      count: characters.length,
      percentage: (characters.length / filteredRoster.length) * 100,
      avgIlvl: roundToOneDecimal(ilvls.reduce((a, b) => a + b, 0) / ilvls.length),
      maxIlvl: roundToOneDecimal(Math.max(...ilvls)),
      minIlvl: roundToOneDecimal(Math.min(...ilvls)),
      medianIlvl: getMedian(ilvls),
      tanks,
      healers,
      dps: characters.length - tanks - healers,
    })
  }

  // Sort by count (descending)
  classByStats.sort((a, b) => b.count - a.count)

  const craftedRoleStats: CraftedRoleStats[] = []
  const craftedRoleOrder: CharacterRole[] = ['tank', 'healer', 'dps']
  for (const role of craftedRoleOrder) {
    const roleClassMap = craftedRoleClassMap.get(role)
    const classStats: CraftedClassStats[] = []

    if (roleClassMap) {
      for (const [className, classCrafted] of roleClassMap.entries()) {
        const craftedCharacters = [...classCrafted.craftedCharacters].sort((a, b) => a.localeCompare(b))
        const nonCraftedCharacters = [...classCrafted.nonCraftedCharacters].sort((a, b) => a.localeCompare(b))

        classStats.push({
          className,
          craftedCount: classCrafted.craftedCount,
          nonCraftedCount: classCrafted.nonCraftedCount,
          total: classCrafted.craftedCount + classCrafted.nonCraftedCount,
          craftedCharacters,
          nonCraftedCharacters,
        })
      }
    }

    classStats.sort((a, b) => {
      const aPct = a.total > 0 ? a.craftedCount / a.total : 0
      const bPct = b.total > 0 ? b.craftedCount / b.total : 0
      if (bPct !== aPct) {
        return bPct - aPct
      }
      if (b.craftedCount !== a.craftedCount) {
        return b.craftedCount - a.craftedCount
      }
      return b.total - a.total
    })

    craftedRoleStats.push({ role, classStats })
  }

  // Calculate role stats with spec breakdown
  const roleStats: RoleStats[] = []
  for (const [role, characters] of roleMap.entries()) {
    const ilvls = characters.map(c => c.character.itemLevelEquipped).sort((a, b) => a - b)
    
    // Calculate spec stats for this role using role-aware buckets
    const roleBucketMap = new Map<string, GuildRosterCharacter[]>()
    for (const character of characters) {
      const bucketName = getRoleBucketName(character, role)
      if (!roleBucketMap.has(bucketName)) {
        roleBucketMap.set(bucketName, [])
      }
      roleBucketMap.get(bucketName)!.push(character)
    }

    const specStatsForRole: SpecStats[] = []
    for (const [specName, specCharacters] of roleBucketMap.entries()) {
      const sortedDesc = [...specCharacters].sort(
        (a, b) => b.character.itemLevelEquipped - a.character.itemLevelEquipped
      )
      const avgIlvl = roundToOneDecimal(
        sortedDesc.reduce((sum, char) => sum + char.character.itemLevelEquipped, 0) / sortedDesc.length
      )

      specStatsForRole.push({
        specName,
        count: specCharacters.length,
        avgIlvl,
        topCharacters: sortedDesc.map(char => ({
          name: char.character.name,
          ilvl: char.character.itemLevelEquipped,
        })),
      })
    }
    
    const roleData: RoleStats = {
      role,
      count: characters.length,
      percentage: (characters.length / filteredRoster.length) * 100,
      avgIlvl: roundToOneDecimal(ilvls.reduce((a, b) => a + b, 0) / ilvls.length),
      maxIlvl: roundToOneDecimal(Math.max(...ilvls)),
      minIlvl: roundToOneDecimal(Math.min(...ilvls)),
      medianIlvl: getMedian(ilvls),
    }
    
    // Add spec breakdown (tanks/healers) or class breakdown (DPS)
    if (role === 'dps') {
      // For DPS, group by class instead of spec
      const dpsClassMap = new Map<string, GuildRosterCharacter[]>()
      for (const char of characters) {
        const className = char.character.class.name
        if (!dpsClassMap.has(className)) {
          dpsClassMap.set(className, [])
        }
        dpsClassMap.get(className)!.push(char)
      }
      
      roleData.classStats = []
      for (const [className, classChars] of dpsClassMap.entries()) {
        const sortedDesc = [...classChars].sort(
          (a, b) => b.character.itemLevelEquipped - a.character.itemLevelEquipped
        )
        const avgIlvl = roundToOneDecimal(
          sortedDesc.reduce((sum, char) => sum + char.character.itemLevelEquipped, 0) / sortedDesc.length
        )
        
        roleData.classStats.push({
          specName: className,
          count: classChars.length,
          avgIlvl,
          topCharacters: sortedDesc.map(char => ({
            name: char.character.name,
            ilvl: char.character.itemLevelEquipped,
          })),
        })
      }
      roleData.classStats.sort((a, b) => a.specName.localeCompare(b.specName))
    } else {
      // For tanks and healers, keep spec breakdown
      roleData.specStats = specStatsForRole
      roleData.specStats.sort((a, b) => a.specName.localeCompare(b.specName))
    }
    
    roleStats.push(roleData)
  }

  const allIilvls = filteredRoster.map(c => c.character.itemLevelEquipped)

  return {
    classByStats,
    craftedRoleStats,
    roleStats,
    totalCount: filteredRoster.length,
    overallAvgIlvl: roundToOneDecimal(allIilvls.reduce((a, b) => a + b, 0) / allIilvls.length),
    overallMaxIlvl: roundToOneDecimal(Math.max(...allIilvls)),
  }
}
