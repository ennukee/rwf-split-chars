import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { RoleStats } from '../lib/analysis'

interface RoleBreakdownProps {
  stats: RoleStats[]
}

export function RoleBreakdown({ stats }: RoleBreakdownProps) {
  const data = [...stats]
    .sort((a, b) => {
      const roleOrder = { tank: 0, healer: 1, dps: 2 }
      return roleOrder[a.role] - roleOrder[b.role]
    })
    .map(s => ({
      role: s.role.charAt(0).toUpperCase() + s.role.slice(1),
      count: s.count,
      avgIlvl: s.avgIlvl,
      maxIlvl: s.maxIlvl,
      percentage: s.percentage.toFixed(1)
    }))

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Role Breakdown</h3>
        <p className="text-xs text-slate-400 mt-1">Character and gear distribution by role</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="role" tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fill: '#94A3B8', fontSize: 12 }} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94A3B8', fontSize: 12 }} label={{ value: 'Avg iLvl', angle: 90, position: 'insideRight' }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#E2E8F0'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Bar yAxisId="left" dataKey="count" fill="#3B82F6" name="Count" radius={[8, 8, 0, 0]} />
          <Bar yAxisId="right" dataKey="avgIlvl" fill="#10B981" name="Avg iLvl" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
