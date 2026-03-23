import { useState, useEffect } from 'react'
import './App.css'
import { GUILDS } from './config/guilds'
import { type GuildRosterCharacter } from './lib/raider-io'
import { analyzeRoster } from './lib/analysis'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import { StatsOverview } from './components/StatsOverview'
import { ClassBreakdownTable } from './components/ClassBreakdownTable'

type RostersData = Record<string, {
  guild: { region: string; realm: string; name: string };
  roster: GuildRosterCharacter[];
  fetchedAt: string;
}>;

function App() {
  const [rosters, setRosters] = useState<RostersData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeGuild, setActiveGuild] = useState<string>('')

  useEffect(() => {
    const loadRosters = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/rosters.json`)
        
        if (!response.ok) {
          throw new Error('Failed to load roster data')
        }
        
        const data: RostersData = await response.json()
        setRosters(data)
        
        // Set first guild as active
        const firstKey = Object.keys(data)[0]
        setActiveGuild(firstKey)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load rosters'
        setError(message)
        console.error('Error loading rosters:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRosters()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500 mx-auto"></div>
          <p className="text-lg font-medium text-slate-300">Loading rosters...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/50 backdrop-blur p-8 max-w-md">
          <h2 className="mb-3 text-lg font-semibold text-red-400">Error Loading Rosters</h2>
          <p className="text-red-300/90 text-sm">{error}</p>
          <p className="mt-4 text-xs text-red-400/70">Make sure rosters have been fetched. Run the GitHub workflow manually if needed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Tabs value={activeGuild} onValueChange={setActiveGuild} className="w-full">
          <div className="mb-12">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-1 rounded-xl gap-1 mb-4">
              {GUILDS.map((guild) => {
                const key = `${guild.region}/${guild.realm}/${guild.name}`
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="px-6 py-2.5 rounded-lg font-medium data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    {guild.name}
                  </TabsTrigger>
                )
              })}
            </TabsList>
            <p className="text-xs text-slate-500">
              Data reflects specialization and equipped gear when logged off. Metrics are calculated after removing the lowest 25% of characters by equipped item level in each guild roster.
            </p>
          </div>

          {GUILDS.map((guild) => {
            const key = `${guild.region}/${guild.realm}/${guild.name}`
            const data = rosters[key]
            const guildAnalysis = data ? analyzeRoster(data.roster) : null

            if (!data || !guildAnalysis) {
              return (
                <TabsContent key={key} value={key} className="space-y-4">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur p-12 text-center">
                    <p className="text-slate-400">No data available for {guild.name}</p>
                  </div>
                </TabsContent>
              )
            }

            return (
              <TabsContent key={key} value={key} className="space-y-10 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">{guild.name}</h2>
                  <p className="text-slate-400 text-sm">
                    Last updated <span className="text-blue-400">{new Date(data.fetchedAt).toLocaleString()}</span>
                  </p>
                  <p className="text-slate-400 text-sm">
                    Note: Data cuts off any character below i254, as well as the bottom 25% of ilvl afterward, to help create accurate data by ignoring max-level characters not intended for potential use.
                  </p>
                </div>

                <StatsOverview
                  roleStats={guildAnalysis.roleStats}
                />

                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-8 hover:border-blue-500/30 transition-colors">
                  <ClassBreakdownTable stats={guildAnalysis.classByStats} />
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
      <footer className="border-t border-slate-800/70 px-6 py-4">
        <p className="mx-auto max-w-7xl text-center text-xs text-slate-500">
          Found a bug or have an idea to suggest? You can reach me on Discord at @ennukee.
        </p>
      </footer>
    </div>
  )
}

export default App
