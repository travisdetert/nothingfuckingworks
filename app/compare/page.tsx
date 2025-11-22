import Link from 'next/link'
import { client } from '@/lib/sanity'
import { categoryHierarchy, getPrimaryCategoryLabel } from '@/lib/categories'

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>
}

interface ComparisonStats {
  category: string
  totalSubmissions: number
  totalReports: number
  totalTimeWasted: number
  avgTimePerReport: number
  avgSeverity: number
  topTags: Array<{ tag: string; count: number }>
  topCompanies: Array<{ company: string; count: number }>
}

async function getCategoryComparisonStats(categoryA?: string, categoryB?: string): Promise<{
  categoryA: ComparisonStats | null
  categoryB: ComparisonStats | null
}> {
  if (!categoryA && !categoryB) {
    return { categoryA: null, categoryB: null }
  }

  const getStatsForCategory = async (category: string): Promise<ComparisonStats> => {
    const submissions = await client.fetch<Array<{
      company: string
      tags?: string[]
      severity: string
      meToos?: Array<{ timeWasted: number }>
    }>>(`*[_type == "submission" && approved == true && primaryCategory == $category]{ company, tags, severity, meToos }`, { category })

    let totalTimeWasted = 0
    let totalReports = 0
    const tagCounts: Record<string, number> = {}
    const companyCounts: Record<string, number> = {}

    const severityValues: Record<string, number> = {
      mild: 1,
      moderate: 2,
      severe: 3,
    }

    let totalSeverity = 0

    submissions.forEach(sub => {
      // Company counts
      companyCounts[sub.company] = (companyCounts[sub.company] || 0) + 1

      // Tags
      if (sub.tags) {
        sub.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }

      // Severity
      totalSeverity += severityValues[sub.severity] || 1

      // Time and reports
      if (sub.meToos) {
        sub.meToos.forEach(m => {
          totalTimeWasted += m.timeWasted || 0
          totalReports++
        })
      }
    })

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const topCompanies = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      category,
      totalSubmissions: submissions.length,
      totalReports,
      totalTimeWasted,
      avgTimePerReport: totalReports > 0 ? Math.round(totalTimeWasted / totalReports) : 0,
      avgSeverity: submissions.length > 0 ? totalSeverity / submissions.length : 0,
      topTags,
      topCompanies,
    }
  }

  const [statsA, statsB] = await Promise.all([
    categoryA ? getStatsForCategory(categoryA) : Promise.resolve(null),
    categoryB ? getStatsForCategory(categoryB) : Promise.resolve(null),
  ])

  return {
    categoryA: statsA,
    categoryB: statsB,
  }
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams
  const categoryA = params.a
  const categoryB = params.b

  const { categoryA: statsA, categoryB: statsB } = await getCategoryComparisonStats(categoryA, categoryB)

  const categoryInfoA = categoryA ? categoryHierarchy.find(c => c.value === categoryA) : null
  const categoryInfoB = categoryB ? categoryHierarchy.find(c => c.value === categoryB) : null

  const availableCategories = categoryHierarchy.filter(c => c.value !== 'other')

  const getWinner = (metricA: number, metricB: number, higherIsBetter: boolean = false) => {
    if (!statsA || !statsB) return null
    if (higherIsBetter) {
      return metricA > metricB ? 'a' : metricB > metricA ? 'b' : 'tie'
    }
    return metricA < metricB ? 'a' : metricB < metricA ? 'b' : 'tie'
  }

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
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors"
            >
              Trends
            </Link>
            <Link
              href="/compare"
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase"
            >
              Compare
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
          <h2 className="text-4xl font-black uppercase mb-4">Category Comparison</h2>
          <p className="text-xl mb-6">
            Compare two categories side-by-side to see which technology domain is failing harder.
          </p>

          {/* Category Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2 uppercase text-sm">Category A</label>
              <select
                value={categoryA || ''}
                onChange={(e) => {
                  const newUrl = new URL(window.location.href)
                  if (e.target.value) {
                    newUrl.searchParams.set('a', e.target.value)
                  } else {
                    newUrl.searchParams.delete('a')
                  }
                  window.location.href = newUrl.toString()
                }}
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white"
              >
                <option value="">Select category...</option>
                {availableCategories.map(cat => (
                  <option key={cat.value} value={cat.value} disabled={cat.value === categoryB}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2 uppercase text-sm">Category B</label>
              <select
                value={categoryB || ''}
                onChange={(e) => {
                  const newUrl = new URL(window.location.href)
                  if (e.target.value) {
                    newUrl.searchParams.set('b', e.target.value)
                  } else {
                    newUrl.searchParams.delete('b')
                  }
                  window.location.href = newUrl.toString()
                }}
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white"
              >
                <option value="">Select category...</option>
                {availableCategories.map(cat => (
                  <option key={cat.value} value={cat.value} disabled={cat.value === categoryA}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(!categoryA || !categoryB) && (
          <div className="text-center py-20">
            <div className="bg-white border-4 border-black p-12 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black mb-4">SELECT TWO CATEGORIES</h3>
              <p className="text-lg">Choose two categories above to begin the comparison.</p>
            </div>
          </div>
        )}

        {categoryA && categoryB && statsA && statsB && categoryInfoA && categoryInfoB && (
          <div>
            {/* Header Comparison */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                <div className="text-6xl mb-4">{categoryInfoA.emoji}</div>
                <h3 className="text-3xl font-black uppercase">{categoryInfoA.label}</h3>
              </div>

              <div className="bg-red-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                <div className="text-6xl mb-4">{categoryInfoB.emoji}</div>
                <h3 className="text-3xl font-black uppercase">{categoryInfoB.label}</h3>
              </div>
            </div>

            {/* Stats Comparison */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
              <h3 className="text-2xl font-black uppercase mb-6">Head-to-Head Stats</h3>

              <div className="space-y-4">
                {/* Total Broken Things */}
                <ComparisonRow
                  label="Total Broken Things"
                  valueA={statsA.totalSubmissions}
                  valueB={statsB.totalSubmissions}
                  winner={getWinner(statsA.totalSubmissions, statsB.totalSubmissions)}
                  higherIsBetter={false}
                />

                {/* Total Reports */}
                <ComparisonRow
                  label="Total Reports"
                  valueA={statsA.totalReports}
                  valueB={statsB.totalReports}
                  winner={getWinner(statsA.totalReports, statsB.totalReports)}
                  higherIsBetter={false}
                />

                {/* Total Time Wasted */}
                <ComparisonRow
                  label="Total Time Wasted (minutes)"
                  valueA={statsA.totalTimeWasted.toLocaleString()}
                  valueB={statsB.totalTimeWasted.toLocaleString()}
                  winner={getWinner(statsA.totalTimeWasted, statsB.totalTimeWasted)}
                  higherIsBetter={false}
                />

                {/* Avg Time Per Report */}
                <ComparisonRow
                  label="Avg Time Per Report (minutes)"
                  valueA={statsA.avgTimePerReport}
                  valueB={statsB.avgTimePerReport}
                  winner={getWinner(statsA.avgTimePerReport, statsB.avgTimePerReport)}
                  higherIsBetter={false}
                />

                {/* Avg Severity */}
                <ComparisonRow
                  label="Avg Severity"
                  valueA={`${statsA.avgSeverity.toFixed(2)} ${statsA.avgSeverity >= 2.5 ? '💀' : statsA.avgSeverity >= 1.5 ? '🤬' : '😠'}`}
                  valueB={`${statsB.avgSeverity.toFixed(2)} ${statsB.avgSeverity >= 2.5 ? '💀' : statsB.avgSeverity >= 1.5 ? '🤬' : '😠'}`}
                  winner={getWinner(statsA.avgSeverity, statsB.avgSeverity)}
                  higherIsBetter={false}
                />
              </div>
            </div>

            {/* Top Issues & Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <h4 className="text-xl font-black uppercase mb-4">{categoryInfoA.emoji} Top Companies</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {statsA.topCompanies.map(({ company, count }) => (
                    <li key={company} className="font-bold">
                      {company} <span className="text-gray-600">({count})</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <h4 className="text-xl font-black uppercase mb-4">{categoryInfoB.emoji} Top Companies</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {statsB.topCompanies.map(({ company, count }) => (
                    <li key={company} className="font-bold">
                      {company} <span className="text-gray-600">({count})</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
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

function ComparisonRow({
  label,
  valueA,
  valueB,
  winner,
  higherIsBetter = false,
}: {
  label: string
  valueA: string | number
  valueB: string | number
  winner: 'a' | 'b' | 'tie' | null
  higherIsBetter?: boolean
}) {
  return (
    <div className="border-b-2 border-gray-200 pb-4">
      <div className="text-sm font-bold uppercase text-gray-600 mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 border-2 border-black text-center ${
          winner === 'a' ? 'bg-green-100' : winner === 'b' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <div className="text-2xl font-black">
            {valueA}
            {winner === 'a' && ' ✅'}
          </div>
        </div>
        <div className={`p-4 border-2 border-black text-center ${
          winner === 'b' ? 'bg-green-100' : winner === 'a' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <div className="text-2xl font-black">
            {valueB}
            {winner === 'b' && ' ✅'}
          </div>
        </div>
      </div>
    </div>
  )
}
