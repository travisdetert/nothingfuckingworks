import Link from 'next/link'
import { client } from '@/lib/sanity'

interface OffenderStats {
  company: string
  count: number
  totalTimeWasted: number
  avgSeverity: number
}

async function getOffendersStats(): Promise<OffenderStats[]> {
  const submissions = await client.fetch<Array<{company: string, timeWasted: number, severity: string}>>(
    `*[_type == "submission" && approved == true]{ company, timeWasted, severity }`
  )

  // Aggregate by company
  const companyMap = new Map<string, { count: number; totalTime: number; severities: number[] }>()

  const severityValues: Record<string, number> = {
    mild: 1,
    moderate: 2,
    severe: 3,
  }

  submissions.forEach((sub) => {
    const existing = companyMap.get(sub.company) || { count: 0, totalTime: 0, severities: [] }
    existing.count++
    existing.totalTime += sub.timeWasted || 0
    existing.severities.push(severityValues[sub.severity] || 1)
    companyMap.set(sub.company, existing)
  })

  // Convert to array and calculate averages
  const offenders: OffenderStats[] = Array.from(companyMap.entries()).map(([company, stats]) => ({
    company,
    count: stats.count,
    totalTimeWasted: stats.totalTime,
    avgSeverity: stats.severities.reduce((a, b) => a + b, 0) / stats.severities.length,
  }))

  // Sort by total time wasted
  return offenders.sort((a, b) => b.totalTimeWasted - a.totalTimeWasted)
}

export default async function OffendersPage() {
  const offenders = await getOffendersStats()

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
              href="/offenders"
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase"
            >
              Worst Offenders
            </Link>
            <Link
              href="/submit"
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors"
            >
              Submit Your Pain
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
          <h2 className="text-4xl font-black uppercase mb-4">Hall of Shame</h2>
          <p className="text-xl">
            The companies, products, and devices wasting the most of your precious time.
          </p>
        </div>

        {offenders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white border-4 border-black p-12 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black mb-4">NO DATA YET</h3>
              <p className="text-lg">Submit some broken tech to populate this list!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {offenders.map((offender, index) => (
              <Link
                key={offender.company}
                href={`/offenders/${encodeURIComponent(offender.company)}`}
              >
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all p-6 cursor-pointer">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-gray-300 min-w-[60px]">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase mb-1">
                          {offender.company}
                        </h3>
                        <div className="flex gap-3 text-sm">
                          <span className="font-bold">{offender.count} complaints</span>
                          <span className="text-gray-400">•</span>
                          <span className={`font-bold ${
                            offender.avgSeverity >= 2.5 ? 'text-red-600' :
                            offender.avgSeverity >= 1.5 ? 'text-orange-600' :
                            'text-yellow-600'
                          }`}>
                            {offender.avgSeverity >= 2.5 ? '💀 Soul Crushing' :
                             offender.avgSeverity >= 1.5 ? '🤬 Rage Inducing' :
                             '😠 Annoying'} avg
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-red-600">
                        {offender.totalTimeWasted.toLocaleString()}
                      </div>
                      <div className="text-sm font-bold uppercase">
                        Minutes Wasted
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
