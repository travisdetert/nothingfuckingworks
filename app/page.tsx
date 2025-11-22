import Link from 'next/link'
import { client } from '@/lib/sanity'
import { Submission } from '@/lib/sanity'
import SubmissionCard from '@/components/SubmissionCard'
import Header from '@/components/Header'

function formatTimeWasted(minutes: number): { value: string; unit: string; subtext: string } {
  if (minutes < 60) {
    return { value: minutes.toString(), unit: 'Minutes', subtext: 'wasted' }
  } else if (minutes < 1440) { // Less than a day
    const hours = Math.round(minutes / 60)
    return { value: hours.toString(), unit: hours === 1 ? 'Hour' : 'Hours', subtext: 'wasted' }
  } else if (minutes < 10080) { // Less than a week
    const days = Math.round(minutes / 1440)
    return { value: days.toString(), unit: days === 1 ? 'Day' : 'Days', subtext: 'wasted' }
  } else {
    const weeks = Math.round(minutes / 10080)
    return { value: weeks.toString(), unit: weeks === 1 ? 'Week' : 'Weeks', subtext: 'wasted' }
  }
}

async function getSubmissions(): Promise<Submission[]> {
  const query = `
    *[_type == "submission" && approved == true] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      company,
      description,
      screenshot,
      category,
      primaryCategory,
      subcategory,
      tags,
      severity,
      submittedBy,
      upvotes,
      meToos,
      approved,
      publishedAt
    }
  `
  return client.fetch(query)
}

async function getTotalStats() {
  const submissions = await client.fetch<Submission[]>(
    `*[_type == "submission" && approved == true]{ company, meToos, severity, category, primaryCategory, publishedAt }`
  )

  let totalTimeWasted = 0
  let totalReports = 0
  const uniquePeople = new Set<string>()
  const companyTimeMap = new Map<string, number>()
  const severityCount = { trivial: 0, mild: 0, moderate: 0, serious: 0, severe: 0, critical: 0 }
  const categoryCount: Record<string, number> = {}
  let mostRecentTimestamp = ''

  submissions.forEach(s => {
    // Track most recent
    if (s.publishedAt > mostRecentTimestamp) {
      mostRecentTimestamp = s.publishedAt
    }

    // Count severity
    severityCount[s.severity as keyof typeof severityCount]++

    // Count category
    if (s.category) {
      categoryCount[s.category] = (categoryCount[s.category] || 0) + 1
    }

    // Add all Me Too time and track unique people
    if (s.meToos) {
      s.meToos.forEach(m => {
        totalTimeWasted += m.timeWasted || 0
        totalReports++
        uniquePeople.add(m.submittedBy)

        // Track time by company
        const currentCompanyTime = companyTimeMap.get(s.company) || 0
        companyTimeMap.set(s.company, currentCompanyTime + (m.timeWasted || 0))
      })
    }
  })

  // Find worst offender
  let worstOffender = { company: '', time: 0 }
  companyTimeMap.forEach((time, company) => {
    if (time > worstOffender.time) {
      worstOffender = { company, time }
    }
  })

  return {
    totalSubmissions: submissions.length,
    totalReports,
    totalTimeWasted,
    uniquePeople: uniquePeople.size,
    worstOffender,
    severityCount,
    categoryCount,
    mostRecentTimestamp
  }
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    primaryCategory?: string
    tag?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const selectedCategory = params.category // legacy
  const selectedPrimaryCategory = params.primaryCategory
  const selectedTag = params.tag

  const allSubmissions = await getSubmissions()

  // Apply filters
  let submissions = allSubmissions
  if (selectedCategory) {
    // Legacy category filter
    submissions = submissions.filter(s => s.category === selectedCategory)
  }
  if (selectedPrimaryCategory) {
    submissions = submissions.filter(s => s.primaryCategory === selectedPrimaryCategory)
  }
  if (selectedTag) {
    submissions = submissions.filter(s => s.tags?.includes(selectedTag))
  }

  const stats = await getTotalStats()
  const timeFormatted = formatTimeWasted(stats.totalTimeWasted)

  const categoryLabels: Record<string, string> = {
    software: 'Software',
    website: 'Websites',
    hardware: 'Hardware',
    os: 'OS',
    iot: 'IoT',
    payment: 'Banking',
    transportation: 'Transport',
    mobile: 'Mobile',
    gaming: 'Gaming',
    enterprise: 'Enterprise',
    social: 'Social',
    streaming: 'Streaming',
    ecommerce: 'E-commerce',
    cloud: 'Cloud',
    productivity: 'Productivity',
    security: 'Security',
    communication: 'Comms',
    healthcare: 'Healthcare',
    education: 'Education',
    government: 'Government',
    other: 'Other',
  }

  return (
    <div className="min-h-screen bg-yellow-400">
      <Header />

      {/* Stats Bar */}
      <div className="bg-black border-b-4 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-2xl font-black">{stats.totalReports.toLocaleString()}</span>
              <span className="text-white text-sm font-bold uppercase">Reports</span>
            </div>
            <div className="text-white text-xl">•</div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-2xl font-black">{timeFormatted.value} {timeFormatted.unit}</span>
              <span className="text-white text-sm font-bold uppercase">Wasted</span>
            </div>
            <div className="text-white text-xl">•</div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500 text-2xl font-black">{stats.uniquePeople.toLocaleString()}</span>
              <span className="text-white text-sm font-bold uppercase">Victims</span>
            </div>
            <div className="text-white text-xl">•</div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-2xl font-black">{stats.totalSubmissions}</span>
              <span className="text-white text-sm font-bold uppercase">Broken</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="bg-yellow-400 border-b-4 border-black py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Worst Offender */}
              {stats.worstOffender.company && (
                <Link href={`/offenders/${encodeURIComponent(stats.worstOffender.company)}`}>
                  <div className="bg-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👑</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold uppercase text-gray-600">Worst</div>
                          <div className="text-sm font-black truncate">{stats.worstOffender.company}</div>
                        </div>
                      </div>
                      <div className="text-xl font-black text-red-600 whitespace-nowrap">{formatTimeWasted(stats.worstOffender.time).value}</div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rage Distribution */}
              <div className="bg-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-xs font-black uppercase mb-2 text-gray-600">Rage Level</div>
                <div className="flex items-center gap-1 h-6">
                  <div className="flex-1 bg-yellow-500 border-2 border-black flex items-center justify-center text-xs font-bold" style={{ flex: stats.severityCount.mild }}>
                    {stats.severityCount.mild > 0 && stats.severityCount.mild}
                  </div>
                  <div className="flex-1 bg-orange-500 border-2 border-black flex items-center justify-center text-xs font-bold text-white" style={{ flex: stats.severityCount.moderate }}>
                    {stats.severityCount.moderate > 0 && stats.severityCount.moderate}
                  </div>
                  <div className="flex-1 bg-red-600 border-2 border-black flex items-center justify-center text-xs font-bold text-white" style={{ flex: stats.severityCount.severe }}>
                    {stats.severityCount.severe > 0 && stats.severityCount.severe}
                  </div>
                </div>
              </div>

              {/* Top Category */}
              <div className="bg-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-xs font-black uppercase mb-2 text-gray-600">Top Culprit</div>
                {Object.entries(stats.categoryCount).sort(([, a], [, b]) => b - a)[0] && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black">{categoryLabels[Object.entries(stats.categoryCount).sort(([, a], [, b]) => b - a)[0][0]]}</div>
                    <div className="text-xl font-black text-blue-600">{Object.entries(stats.categoryCount).sort(([, a], [, b]) => b - a)[0][1]}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-black text-white border-b-4 border-black sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-3 py-3 flex-wrap">
            <Link
              href="/categories"
              className="px-4 py-2 bg-white text-black font-bold uppercase text-sm hover:bg-yellow-400 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/offenders"
              className="px-4 py-2 bg-white text-black font-bold uppercase text-sm hover:bg-yellow-400 transition-colors"
            >
              Offenders
            </Link>
            <Link
              href="/submit"
              className="px-4 py-2 bg-yellow-400 text-black font-bold uppercase text-sm hover:bg-white transition-colors"
            >
              Submit
            </Link>
          </div>
        </div>
      </nav>

      {/* Category Filter */}
      <div className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/"
              className={`px-3 py-1 text-sm font-bold uppercase border-2 border-black hover:bg-yellow-400 transition-colors ${!selectedCategory ? 'bg-yellow-400' : 'bg-white'}`}
            >
              All
            </Link>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Link
                key={key}
                href={`/?category=${key}`}
                className={`px-3 py-1 text-sm font-bold uppercase border-2 border-black hover:bg-yellow-400 transition-colors ${selectedCategory === key ? 'bg-yellow-400' : 'bg-white'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {selectedCategory && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase">
              {categoryLabels[selectedCategory]} Failures
            </h2>
            <p className="text-sm font-bold mt-1">
              Showing {submissions.length} broken {submissions.length === 1 ? 'thing' : 'things'}
            </p>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white border-4 border-black p-12 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black mb-4">NO SUBMISSIONS YET</h2>
              <p className="text-xl mb-6">Be the first to share your broken tech!</p>
              <Link
                href="/submit"
                className="inline-block bg-black text-white font-black uppercase py-4 px-8 border-4 border-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Submit Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {submissions.map((submission) => (
              <SubmissionCard key={submission._id} submission={submission} />
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
          <p className="text-sm mt-2 text-gray-600">
            Submit your broken tech experiences and let the world know.
          </p>
        </div>
      </footer>
    </div>
  )
}
