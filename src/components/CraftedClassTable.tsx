import type { CraftedRoleStats } from '../lib/analysis'
import { getClassColor } from '../lib/classColors'

interface CraftedClassTableProps {
  roleStats: CraftedRoleStats[]
}

export function CraftedClassTable({ roleStats }: CraftedClassTableProps) {
  const roleLabels: Record<CraftedRoleStats['role'], string> = {
    tank: 'Tanks',
    healer: 'Healers',
    dps: 'DPS',
  }

  const getNamesTooltip = (title: string, names: string[]): string => {
    if (names.length === 0) {
      return `${title}\nNone`
    }
    return `${title}\n${names.join('\n')}`
  }

  const formatPct = (craftedCount: number, total: number): string => {
    if (total === 0) {
      return '0.0%'
    }
    return `${((craftedCount / total) * 100).toFixed(1)}%`
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Crafted Weapon Coverage</h3>
        <p className="text-xs text-slate-400 mt-1">Per-class crafted status split by role (C = crafted, N = not crafted)</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {roleStats.map((roleStat) => (
          <div key={roleStat.role} className="overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-2 py-2 text-left font-semibold text-slate-200">{roleLabels[roleStat.role]}</th>
                  <th className="px-2 py-2 text-center font-semibold text-emerald-400">C</th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-300">N</th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-200">%</th>
                </tr>
              </thead>
              <tbody>
                {roleStat.classStats.length > 0 ? (
                  roleStat.classStats.map((stat) => (
                    <tr
                      key={`${roleStat.role}-${stat.className}`}
                      className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td
                        className="px-2 py-2 font-semibold"
                        style={{ color: getClassColor(stat.className) }}
                      >
                        {stat.className}
                      </td>
                      <td
                        className="px-2 py-2 text-center text-emerald-400 font-semibold cursor-default"
                        title={getNamesTooltip(`${stat.className} Crafted`, stat.craftedCharacters)}
                      >
                        {stat.craftedCount}
                      </td>
                      <td
                        className="px-2 py-2 text-center text-slate-300 font-semibold cursor-default"
                        title={getNamesTooltip(`${stat.className} Not Crafted`, stat.nonCraftedCharacters)}
                      >
                        {stat.nonCraftedCount}
                      </td>
                      <td className="px-2 py-2 text-center text-slate-200">{formatPct(stat.craftedCount, stat.total)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-2 py-3 text-center text-slate-500" colSpan={4}>No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
