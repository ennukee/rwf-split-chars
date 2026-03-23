import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { ClassStats } from '../lib/analysis'
import { getClassColor } from '../lib/classColors'

const COLORS = [
  '#3B82F6', '#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', 
  '#EF4444', '#EC4899', '#8B5CF6', '#6366F1', '#14B8A6',
  '#F97316', '#A855F7', '#64748B', '#78716C', '#7C3AED'
]

interface ClassDistributionProps {
  stats: ClassStats[]
}

export function ClassDistribution({ stats }: ClassDistributionProps) {
  const data = stats.map(s => ({
    name: s.className,
    value: s.count
  }))

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Class Distribution</h3>
        <p className="text-xs text-slate-400 mt-1">Character count by class</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name} (${value})`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#E2E8F0'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ILvlByClassProps {
  stats: ClassStats[]
}

export function ILvlByClass({ stats }: ILvlByClassProps) {
  // Sort by median ilvl ascending
  const sortedStats = [...stats].sort((a, b) => a.medianIlvl - b.medianIlvl)
  
  const data = sortedStats.map(s => ({
    class: s.className.substring(0, 8),
    median: s.medianIlvl,
    fullName: s.className
  }))

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Item Level by Class</h3>
        <p className="text-xs text-slate-400 mt-1">Median gear level across classes</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="class" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#E2E8F0'
            }}
          />
          <Bar 
            dataKey="median" 
            fill="#10B981" 
            name="Median iLvl"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getClassColor(entry.fullName)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
