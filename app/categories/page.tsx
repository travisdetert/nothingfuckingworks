import Link from 'next/link'
import { client } from '@/lib/sanity'
import { categoryHierarchy, getPrimaryCategoryLabel } from '@/lib/categories'
import Header from '@/components/Header'

interface CategoryStats {
  primaryCategory: string
  count: number
  totalReports: number
  totalTimeWasted: number
  avgSeverity: number
}

async function getCategoryStats(): Promise<CategoryStats[]> {
  const submissions = await client.fetch<Array<{
    primaryCategory: string
    subcategory: string
    severity: string
    meToos?: Array<{timeWasted: number}>
  }>>(`*[_type == "submission" && approved == true]{ primaryCategory, subcategory, severity, meToos }`)

  // Aggregate by primary category
  const categoryMap = new Map<string, { count: number; totalReports: number; totalTime: number; severities: number[] }>()

  const severityValues: Record<string, number> = {
    mild: 1,
    moderate: 2,
    severe: 3,
  }

  submissions.forEach((sub) => {
    const existing = categoryMap.get(sub.primaryCategory) || { count: 0, totalReports: 0, totalTime: 0, severities: [] }
    existing.count++

    // Add all Me Too time
    if (sub.meToos) {
      sub.meToos.forEach(meToo => {
        existing.totalReports++
        existing.totalTime += meToo.timeWasted || 0
      })
    }

    existing.severities.push(severityValues[sub.severity] || 1)
    categoryMap.set(sub.primaryCategory, existing)
  })

  // Convert to array and calculate averages
  const stats: CategoryStats[] = Array.from(categoryMap.entries()).map(([primaryCategory, data]) => ({
    primaryCategory,
    count: data.count,
    totalReports: data.totalReports,
    totalTimeWasted: data.totalTime,
    avgSeverity: data.severities.reduce((a, b) => a + b, 0) / data.severities.length,
  }))

  // Sort by total time wasted
  return stats.sort((a, b) => b.totalTimeWasted - a.totalTimeWasted)
}

export default async function CategoriesPage() {
  const stats = await getCategoryStats()

  return (
    <div className="min-h-screen bg-yellow-400">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 mb-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-2">Category Explorer</h2>
          <p className="text-base md:text-lg">
            Explore broken technology by category. Click any category to see detailed statistics and submissions.
          </p>
        </div>

        {stats.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <div className="bg-white border-4 border-black p-8 md:p-12 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl md:text-2xl font-black mb-4">NO DATA YET</h3>
              <p className="text-base md:text-lg">Submit some broken tech to populate this list!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryHierarchy.filter(cat => cat.value !== 'other').map((category) => {
              const categoryStats = stats.find(s => s.primaryCategory === category.value)
              const hasData = categoryStats && categoryStats.count > 0

              return (
                <Link
                  key={category.value}
                  href={hasData ? `/categories/${category.value}` : '#'}
                  className={hasData ? '' : 'pointer-events-none'}
                >
                  <div
                    className={`bg-white border-4 border-black p-4 transition-all h-full flex flex-col ${
                      hasData
                        ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] cursor-pointer'
                        : 'opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-3xl">{category.emoji}</div>
                        <h3 className="text-base font-black uppercase leading-tight">{category.label}</h3>
                      </div>
                      {hasData && categoryStats && (
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-red-600">
                            {categoryStats.count}
                          </div>
                        </div>
                      )}
                    </div>

                    {hasData && categoryStats ? (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3">
                        <div>
                          <span className="font-black">{categoryStats.totalReports}</span>
                          <span className="text-gray-600 ml-1">reports</span>
                        </div>
                        <div>
                          <span className="font-black">{categoryStats.totalTimeWasted.toLocaleString()}</span>
                          <span className="text-gray-600 ml-1">min</span>
                        </div>
                        <div>
                          <span className={`font-black ${
                            categoryStats.avgSeverity >= 2.5 ? 'text-red-600' :
                            categoryStats.avgSeverity >= 1.5 ? 'text-orange-600' :
                            'text-yellow-600'
                          }`}>
                            {categoryStats.avgSeverity >= 2.5 ? '💀' :
                             categoryStats.avgSeverity >= 1.5 ? '🤬' :
                             '😠'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic mb-3">No reports yet</p>
                    )}

                    <div className="mt-auto pt-3 border-t-2 border-gray-200">
                      <div className="text-xs text-gray-600 font-bold mb-1.5">
                        {category.subcategories.length} subcategories
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 3).map(sub => (
                          <span
                            key={sub.value}
                            className="px-1.5 py-0.5 bg-gray-100 text-[10px] font-bold border border-gray-300 leading-tight"
                          >
                            {sub.label}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                            +{category.subcategories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
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
