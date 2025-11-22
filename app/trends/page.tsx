import Link from 'next/link'
import { client } from '@/lib/sanity'
import CategoryBreakdown from '@/components/charts/CategoryBreakdown'
import TimeWastedChart from '@/components/charts/TimeWastedChart'
import TagCloud from '@/components/charts/TagCloud'
import SeverityHeatmap from '@/components/charts/SeverityHeatmap'
import { categoryHierarchy } from '@/lib/categories'

interface TrendsData {
  categoryBreakdown: Record<string, number>
  companyLeaderboard: { label: string; time: number }[]
  tagCounts: Record<string, number>
  severityByCategory: Array<{
    primaryCategory: string
    mild: number
    moderate: number
    severe: number
  }>
  timelineData: Array<{
    month: string
    count: number
    totalTime: number
  }>
}

async function getTrendsData(): Promise<TrendsData> {
  const submissions = await client.fetch<Array<{
    primaryCategory: string
    company: string
    tags?: string[]
    severity: string
    meToos?: Array<{ timeWasted: number }>
    publishedAt: string
  }>>(`*[_type == "submission" && approved == true]{ primaryCategory, company, tags, severity, meToos, publishedAt }`)

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {}

  // Company time tracking
  const companyTimeMap = new Map<string, number>()

  // Tag counts
  const tagCounts: Record<string, number> = {}

  // Severity by category
  const severityMap = new Map<string, { mild: number; moderate: number; severe: number }>()

  // Timeline data (by month)
  const timelineMap = new Map<string, { count: number; totalTime: number }>()

  submissions.forEach(sub => {
    // Category breakdown
    categoryBreakdown[sub.primaryCategory] = (categoryBreakdown[sub.primaryCategory] || 0) + 1

    // Tags
    if (sub.tags) {
      sub.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }

    // Severity by category
    const severityData = severityMap.get(sub.primaryCategory) || { mild: 0, moderate: 0, severe: 0 }
    severityData[sub.severity as keyof typeof severityData]++
    severityMap.set(sub.primaryCategory, severityData)

    // Company time
    if (sub.meToos) {
      const totalTime = sub.meToos.reduce((sum, m) => sum + (m.timeWasted || 0), 0)
      const currentTime = companyTimeMap.get(sub.company) || 0
      companyTimeMap.set(sub.company, currentTime + totalTime)
    }

    // Timeline
    const date = new Date(sub.publishedAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const timelineData = timelineMap.get(monthKey) || { count: 0, totalTime: 0 }
    timelineData.count++
    if (sub.meToos) {
      timelineData.totalTime += sub.meToos.reduce((sum, m) => sum + (m.timeWasted || 0), 0)
    }
    timelineMap.set(monthKey, timelineData)
  })

  // Convert company map to sorted array
  const companyLeaderboard = Array.from(companyTimeMap.entries())
    .map(([label, time]) => ({ label, time }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 10)

  // Convert severity map to array
  const severityByCategory = Array.from(severityMap.entries())
    .map(([primaryCategory, data]) => ({
      primaryCategory,
      ...data,
    }))
    .filter(d => d.mild + d.moderate + d.severe > 0)
    .sort((a, b) => (b.mild + b.moderate + b.severe) - (a.mild + a.moderate + a.severe))

  // Convert timeline map to sorted array
  const timelineData = Array.from(timelineMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return {
    categoryBreakdown,
    companyLeaderboard,
    tagCounts,
    severityByCategory,
    timelineData,
  }
}

export default async function TrendsPage() {
  const data = await getTrendsData()

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="border-b-8 border-black bg-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <h1 className="text-4xl md:text-6xl font-black uppercase text-center hover:underline cursor-pointer">
              Nothing Fucking Works
            </h1>
          </Link>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black text-white border-b-4 border-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 py-4">
            <Link
              href="/"
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/trends"
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase"
            >
              Trends
            </Link>
            <Link
              href="/offenders"
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors"
            >
              Offenders
            </Link>
            <Link
              href="/submit"
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors"
            >
              Submit
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
          <h2 className="text-4xl font-black uppercase mb-4">Trends & Analytics</h2>
          <p className="text-xl">
            Deep dive into the data. Discover patterns, track the worst offenders, and see what's breaking most often.
          </p>
        </div>

        {/* Timeline */}
        {data.timelineData.length > 0 && (
          <div className="mb-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <h3 className="text-2xl font-black uppercase mb-6">Submissions Over Time</h3>
            <div className="flex items-end gap-2 h-64">
              {data.timelineData.map((item, index) => {
                const maxCount = Math.max(...data.timelineData.map(d => d.count))
                const heightPercent = (item.count / maxCount) * 100
                const date = new Date(item.month + '-01')
                const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gradient-to-t from-red-600 to-yellow-400 border-2 border-black relative group cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count} reports
                        <br />
                        {item.totalTime.toLocaleString()} min
                      </div>
                    </div>
                    <div className="text-xs font-bold transform -rotate-45 origin-top-left whitespace-nowrap">
                      {monthLabel}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <CategoryBreakdown data={data.categoryBreakdown} />

          {/* Company Leaderboard */}
          <TimeWastedChart data={data.companyLeaderboard} title="Worst Offenders (Time Wasted)" />
        </div>

        {/* Tag Cloud */}
        {Object.keys(data.tagCounts).length > 0 && (
          <div className="mb-8">
            <TagCloud data={data.tagCounts} title="Most Common Issues" />
          </div>
        )}

        {/* Severity Heatmap */}
        {data.severityByCategory.length > 0 && (
          <div className="mb-8">
            <SeverityHeatmap data={data.severityByCategory} />
          </div>
        )}

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
            <div className="text-5xl mb-2">📊</div>
            <div className="text-3xl font-black mb-2">{Object.keys(data.categoryBreakdown).length}</div>
            <div className="text-sm font-bold uppercase text-gray-600">Categories Affected</div>
          </div>

          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
            <div className="text-5xl mb-2">🏆</div>
            <div className="text-xl font-black mb-2 truncate">{data.companyLeaderboard[0]?.label || 'N/A'}</div>
            <div className="text-sm font-bold uppercase text-gray-600">Top Time Waster</div>
          </div>

          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
            <div className="text-5xl mb-2">🔥</div>
            <div className="text-3xl font-black mb-2">{Object.keys(data.tagCounts).length}</div>
            <div className="text-sm font-bold uppercase text-gray-600">Unique Issues</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-8 border-black bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-bold">
            Built with frustration. Powered by collective rage.
          </p>
        </div>
      </footer>
    </div>
  )
}
