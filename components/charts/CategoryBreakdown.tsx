'use client'

import { categoryHierarchy } from '@/lib/categories'

interface CategoryBreakdownProps {
  data: Record<string, number>
  title?: string
}

export default function CategoryBreakdown({ data, title = 'Category Breakdown' }: CategoryBreakdownProps) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0)

  // Sort by count descending
  const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a)

  // Get category info
  const dataWithInfo = sortedData.map(([key, count]) => {
    const category = categoryHierarchy.find(c => c.value === key)
    return {
      key,
      count,
      label: category?.label || key,
      emoji: category?.emoji || '📊',
      percentage: Math.round((count / total) * 100),
    }
  })

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h3 className="text-2xl font-black uppercase mb-4">{title}</h3>

      <div className="space-y-3">
        {dataWithInfo.map(({ key, count, label, emoji, percentage }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{emoji}</span>
                <span className="font-bold text-sm">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black">{count}</span>
                <span className="text-xs text-gray-600 font-bold">{percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 h-6 border-2 border-black">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-red-500 border-r-2 border-black transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-gray-300 text-center">
        <div className="text-3xl font-black">{total}</div>
        <div className="text-xs font-bold uppercase text-gray-600">Total Broken Things</div>
      </div>
    </div>
  )
}
