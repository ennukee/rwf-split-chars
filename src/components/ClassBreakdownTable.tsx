import type { ClassStats } from '../lib/analysis'
import { getClassColor } from '../lib/classColors'

interface ClassBreakdownTableProps {
  stats: ClassStats[]
}

export function ClassBreakdownTable({ stats }: ClassBreakdownTableProps) {
  const formatIlvl = (value: number): string => value.toFixed(1)
  const sortedStats = [...stats].sort((a, b) => {
    if (b.avgIlvl !== a.avgIlvl) {
      return b.avgIlvl - a.avgIlvl
    }
    return b.count - a.count
  })

  const tankClasses = new Set([
    'Warrior',
    'Paladin',
    'Death Knight',
    'Monk',
    'Druid',
    'Demon Hunter',
  ])
  const healerClasses = new Set([
    'Priest',
    'Paladin',
    'Shaman',
    'Druid',
    'Monk',
    'Evoker',
  ])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Class Breakdown</h3>
        <p className="text-xs text-slate-400 mt-1">Detailed statistics for each class</p>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="px-4 py-3 text-left font-semibold text-slate-200">Class</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-200">Avg iLvl</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-200">Count</th>
              <th className="px-4 py-3 text-center font-semibold text-blue-400">Tanks</th>
              <th className="px-4 py-3 text-center font-semibold text-emerald-400">Healers</th>
              <th className="px-4 py-3 text-center font-semibold text-orange-400">DPS</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-200">Median</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat, idx) => (
              <tr 
                key={idx} 
                className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors"
              >
                <td 
                  className="px-4 py-3 font-semibold"
                  style={{ color: getClassColor(stat.className) }}
                >
                  {stat.className}
                </td>
                <td className="px-4 py-3 text-center text-slate-200 font-semibold">{formatIlvl(stat.avgIlvl)}</td>
                <td className="px-4 py-3 text-center text-slate-300">{stat.count}</td>
                <td className="px-4 py-3 text-center text-blue-400 font-semibold">
                  {tankClasses.has(stat.className) ? stat.tanks : ''}
                </td>
                <td className="px-4 py-3 text-center text-emerald-400 font-semibold">
                  {healerClasses.has(stat.className) ? stat.healers : ''}
                </td>
                <td className="px-4 py-3 text-center text-orange-400 font-semibold">{stat.dps}</td>
                <td className="px-4 py-3 text-center text-slate-400">{formatIlvl(stat.medianIlvl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
