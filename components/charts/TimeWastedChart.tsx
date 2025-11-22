'use client'

interface TimeWastedChartProps {
  data: { label: string; time: number; emoji?: string }[]
  title?: string
}

export default function TimeWastedChart({ data, title = 'Time Wasted Leaderboard' }: TimeWastedChartProps) {
  const maxTime = Math.max(...data.map(d => d.time))

  // Format time with units
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`
    if (minutes < 10080) return `${Math.round(minutes / 1440)}d`
    return `${Math.round(minutes / 10080)}w`
  }

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h3 className="text-2xl font-black uppercase mb-6">{title}</h3>

      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercent = maxTime > 0 ? (item.time / maxTime) * 100 : 0
          const isTop3 = index < 3

          return (
            <div key={item.label} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {isTop3 && (
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                  {!isTop3 && (
                    <span className="text-lg font-black text-gray-400 min-w-[30px]">
                      #{index + 1}
                    </span>
                  )}
                  {item.emoji && <span className="text-xl">{item.emoji}</span>}
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-red-600">
                    {item.time.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-gray-600 min-w-[40px]">
                    {formatTime(item.time)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-8 border-2 border-black relative overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isTop3
                      ? index === 0
                        ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500'
                        : 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600'
                      : 'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
