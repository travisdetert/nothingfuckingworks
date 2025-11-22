'use client'

import { categoryHierarchy } from '@/lib/categories'

interface HeatmapData {
  primaryCategory: string
  mild: number
  moderate: number
  severe: number
}

interface SeverityHeatmapProps {
  data: HeatmapData[]
  title?: string
}

export default function SeverityHeatmap({ data, title = 'Rage Heatmap by Category' }: SeverityHeatmapProps) {
  // Calculate max for normalization
  const maxTotal = Math.max(...data.map(d => d.mild + d.moderate + d.severe))

  const getIntensity = (count: number, total: number) => {
    if (total === 0) return 0
    return (count / total) * 100
  }

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 overflow-x-auto">
      <h3 className="text-2xl font-black uppercase mb-6">{title}</h3>

      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="font-bold text-sm uppercase text-gray-600">Category</div>
          <div className="font-bold text-sm uppercase text-center text-yellow-700">😠 Mild</div>
          <div className="font-bold text-sm uppercase text-center text-orange-700">🤬 Moderate</div>
          <div className="font-bold text-sm uppercase text-center text-red-700">💀 Severe</div>
        </div>

        {/* Rows */}
        {data.map((row) => {
          const category = categoryHierarchy.find(c => c.value === row.primaryCategory)
          const total = row.mild + row.moderate + row.severe
          const mildPct = getIntensity(row.mild, total)
          const moderatePct = getIntensity(row.moderate, total)
          const severePct = getIntensity(row.severe, total)

          return (
            <div key={row.primaryCategory} className="grid grid-cols-4 gap-2 mb-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>{category?.emoji}</span>
                <span className="truncate">{category?.label || row.primaryCategory}</span>
              </div>

              {/* Mild */}
              <div
                className="border-2 border-black h-12 flex items-center justify-center font-black text-sm relative overflow-hidden"
                style={{
                  backgroundColor: `rgba(234, 179, 8, ${mildPct / 100})`,
                }}
              >
                {row.mild > 0 && row.mild}
              </div>

              {/* Moderate */}
              <div
                className="border-2 border-black h-12 flex items-center justify-center font-black text-sm relative overflow-hidden"
                style={{
                  backgroundColor: `rgba(249, 115, 22, ${moderatePct / 100})`,
                }}
              >
                {row.moderate > 0 && row.moderate}
              </div>

              {/* Severe */}
              <div
                className="border-2 border-black h-12 flex items-center justify-center font-black text-sm text-white relative overflow-hidden"
                style={{
                  backgroundColor: `rgba(220, 38, 38, ${severePct / 100})`,
                }}
              >
                {row.severe > 0 && row.severe}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t-2 border-gray-300 text-xs text-gray-600">
        <span className="font-bold">Color intensity:</span> Higher percentage of reports at that severity level
      </div>
    </div>
  )
}
