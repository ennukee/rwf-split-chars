import type { RoleStats } from '../lib/analysis'
import { getClassColor, getSpecColor } from '../lib/classColors'

interface StatsOverviewProps {
  roleStats: RoleStats[]
}

export function StatsOverview({ roleStats }: StatsOverviewProps) {
  const formatIlvl = (value: number): string => value.toFixed(1)

  const getTopCharactersTooltip = (
    label: string,
    topCharacters: Array<{ name: string; ilvl: number }>
  ): string => {
    const lines = topCharacters
      .map(char => `${char.name} - ${formatIlvl(char.ilvl)}`)
      .join('\n')
    return `${label}\n${lines}`
  }

  const roles = [
    { role: 'tanks', label: 'Tanks', stats: roleStats.find(r => r.role === 'tank') },
    { role: 'healers', label: 'Healers', stats: roleStats.find(r => r.role === 'healer') },
    { role: 'dps', label: 'DPS', stats: roleStats.find(r => r.role === 'dps') }
  ]

  return (
    <div className="space-y-6">
      {/* Role Breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map(({ role, label, stats }) => (
          <div
            key={role}
            className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur p-6 hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="font-semibold text-white">{label}</h3>
              {stats && <span className="text-2xl font-bold text-blue-400">{formatIlvl(stats.avgIlvl)}</span>}
            </div>
            {stats && (
              <div className="space-y-4">
                <div>
                  <div className="space-y-2">
                    {(role === 'dps' ? stats.classStats : stats.specStats)
                      ?.slice()
                      .sort((a, b) => b.avgIlvl - a.avgIlvl)
                      .map((item) => (
                      <div key={item.specName} className="flex justify-between items-center text-sm gap-2">
                        <span
                          className="cursor-default"
                          title={getTopCharactersTooltip(item.specName, item.topCharacters)}
                          style={{ color: role === 'dps' ? getClassColor(item.specName) : getSpecColor(item.specName) }}
                        >
                          {item.specName}
                          <span className="text-slate-500 text-xs ml-1">x{item.count}</span>
                        </span>
                        <span className="font-semibold text-blue-400 shrink-0">{formatIlvl(item.avgIlvl)}</span>
                      </div>
                    )) || <span className="text-slate-500 text-sm">No data</span>}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
