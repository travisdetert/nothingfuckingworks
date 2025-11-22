import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { client, urlFor, Submission } from '@/lib/sanity'
import Giscus from '@/components/Giscus'
import MeTooButton from '@/components/MeTooButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const submission = await getSubmission(slug)

  if (!submission) {
    return {
      title: 'Post Not Found | Nothing Fucking Works',
    }
  }

  return {
    title: `${submission.title} | Nothing Fucking Works`,
    description: submission.description,
  }
}

async function getSubmission(slug: string): Promise<Submission | null> {
  const query = `
    *[_type == "submission" && slug.current == $slug && approved == true][0] {
      _id,
      _createdAt,
      title,
      slug,
      company,
      description,
      screenshot,
      category,
      severity,
      submittedBy,
      upvotes,
      meToos,
      approved,
      publishedAt
    }
  `
  return client.fetch(query, { slug })
}

const categoryLabels: Record<string, string> = {
  software: 'Software/Apps',
  website: 'Website/Web Service',
  hardware: 'Hardware/Device',
  os: 'Operating System',
  iot: 'Smart Home/IoT',
  payment: 'Payment/Banking',
  transportation: 'Transportation',
  mobile: 'Mobile App',
  gaming: 'Gaming/Console',
  enterprise: 'Enterprise Software',
  social: 'Social Media',
  streaming: 'Streaming Service',
  ecommerce: 'E-commerce',
  cloud: 'Cloud Service',
  productivity: 'Productivity Tool',
  security: 'Security/Privacy',
  communication: 'Communication',
  healthcare: 'Healthcare Tech',
  education: 'Education Tech',
  government: 'Government/Public Service',
  other: 'Other',
}

const severityLabels: Record<string, string> = {
  mild: '😠 Mildly Annoying',
  moderate: '🤬 Rage Inducing',
  severe: '💀 Soul Crushing',
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const submission = await getSubmission(slug)

  if (!submission) {
    notFound()
  }

  const imageUrl = urlFor(submission.screenshot).width(1200).height(800).url()

  return (
    <>
      {/* Header */}
      <header className="border-b-8 border-black bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <h1 className="text-3xl md:text-5xl font-black uppercase text-center hover:underline cursor-pointer">
              Nothing Fucking Works
            </h1>
          </Link>
        </div>
        {/* Navigation */}
        <nav className="bg-black text-white border-t-4 border-black">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4 py-3">
              <Link
                href="/"
                className="px-4 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/submit"
                className="px-4 py-2 bg-yellow-400 text-black font-bold uppercase hover:bg-white transition-colors text-sm"
              >
                Submit Your Pain
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="overflow-y-auto bg-yellow-400">
        <div className="px-6 py-6 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            {/* Left: Title and Info */}
            <div>
              <h1 className="text-4xl font-black uppercase mb-4 leading-tight">
                {submission.title}
              </h1>

              <div className="mb-4">
                <Link href={`/offenders/${encodeURIComponent(submission.company)}`}>
                  <span className="text-2xl font-black text-red-600 hover:underline cursor-pointer">
                    {submission.company}
                  </span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-black text-white font-bold text-xs uppercase">
                  {categoryLabels[submission.category]}
                </span>
                <span className="px-3 py-1.5 bg-red-500 text-white font-bold text-xs uppercase">
                  {severityLabels[submission.severity]}
                </span>
                <span className="px-3 py-1.5 border-2 border-black font-bold text-xs uppercase">
                  👍 {submission.upvotes}
                </span>
              </div>

              <div className="text-lg leading-relaxed mb-4">
                {submission.description}
              </div>

              <div className="text-xs text-gray-600">
                Submitted by <span className="font-bold">{submission.submittedBy || 'Anonymous'}</span> on{' '}
                {new Date(submission.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            {/* Right: Screenshot */}
            <div>
              <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={submission.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="mt-4">
                <MeTooButton
                  submissionId={submission._id}
                  submissionTitle={submission.title}
                  initialMeToos={submission.meToos}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {submission.meToos && submission.meToos.length > 0 && (() => {
            const times = submission.meToos.map(m => m.timeWasted)
            const uniquePeople = new Set(submission.meToos.map(m => m.submittedBy)).size
            const totalIncidents = submission.meToos.length
            const totalTime = times.reduce((sum, t) => sum + t, 0)
            const minTime = Math.min(...times)
            const maxTime = Math.max(...times)
            const avgTime = Math.round(totalTime / times.length)

            // Calculate time distribution
            const timeRanges = {
              '<15min': times.filter(t => t < 15).length,
              '15-30min': times.filter(t => t >= 15 && t < 30).length,
              '30-60min': times.filter(t => t >= 30 && t < 60).length,
              '1-2hr': times.filter(t => t >= 60 && t < 120).length,
              '2hr+': times.filter(t => t >= 120).length,
            }

            const groupedByPerson = submission.meToos.reduce((acc, meToo) => {
              const person = meToo.submittedBy || 'Anonymous'
              if (!acc[person]) acc[person] = []
              acc[person].push(meToo)
              return acc
            }, {} as Record<string, typeof submission.meToos>)

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Impact Card */}
                <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                  <h3 className="text-lg font-black uppercase mb-4">Impact Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                      <span className="font-bold">Total Incidents:</span>
                      <span className="text-2xl font-black text-red-600">{totalIncidents}</span>
                    </div>
                    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                      <span className="font-bold">Unique Victims:</span>
                      <span className="text-2xl font-black text-orange-600">{uniquePeople}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Minutes Wasted:</span>
                      <span className="text-2xl font-black text-yellow-600">{totalTime.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Time Analysis Card */}
                <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                  <h3 className="text-lg font-black uppercase mb-4">Time Analysis</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-3xl font-black text-blue-600">{minTime}</div>
                      <div className="text-xs font-bold uppercase text-gray-600">Min</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-yellow-600">{avgTime}</div>
                      <div className="text-xs font-bold uppercase text-gray-600">Avg</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-red-600">{maxTime}</div>
                      <div className="text-xs font-bold uppercase text-gray-600">Max</div>
                    </div>
                  </div>
                </div>

                {/* Top Victims Card */}
                <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                  <h3 className="text-lg font-black uppercase mb-4">Top Victims</h3>
                  <div className="space-y-2">
                    {(() => {
                      const personStats = Object.entries(
                        submission.meToos.reduce((acc, m) => {
                          const person = m.submittedBy || 'Anonymous'
                          if (!acc[person]) acc[person] = { count: 0, totalTime: 0 }
                          acc[person].count++
                          acc[person].totalTime += m.timeWasted
                          return acc
                        }, {} as Record<string, { count: number; totalTime: number }>)
                      ).sort(([, a], [, b]) => b.totalTime - a.totalTime)

                      return personStats.slice(0, 3).map(([person, stats], idx) => (
                        <div key={person} className="flex items-center justify-between border-2 border-gray-300 p-2">
                          <div className="flex items-center gap-2">
                            <div className="text-xl font-black text-gray-400">#{idx + 1}</div>
                            <div className="text-sm font-bold">{person}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-red-600">{stats.totalTime} min</div>
                            <div className="text-xs text-gray-600">{stats.count}x</div>
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </div>
            )
          })()}

        {/* Timeline */}
        {submission.meToos && submission.meToos.length > 0 && (() => {
          const groupedByPerson = submission.meToos.reduce((acc, meToo) => {
            const person = meToo.submittedBy || 'Anonymous'
            if (!acc[person]) acc[person] = []
            acc[person].push(meToo)
            return acc
          }, {} as Record<string, typeof submission.meToos>)

          return (
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
              <h2 className="text-2xl font-black uppercase mb-4">Incident Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(groupedByPerson)
                  .sort(([, a], [, b]) => b.reduce((sum, r) => sum + r.timeWasted, 0) - a.reduce((sum, r) => sum + r.timeWasted, 0))
                  .map(([person, reports]) => {
                    const totalTime = reports.reduce((sum, r) => sum + r.timeWasted, 0)
                    return (
                      <div key={person} className="border-2 border-gray-300 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold">{person}</div>
                          <div className="text-xs font-bold text-red-600">{reports.length}x • {totalTime} min</div>
                        </div>
                        <div className="space-y-1">
                          {reports.map((report, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex justify-between">
                              <span>{new Date(report.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}</span>
                              <span className="font-bold">{report.timeWasted} min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )
        })()}

        {/* Comments Section */}
        {process.env.NEXT_PUBLIC_GISCUS_REPO && (
          <div className="mt-12 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <h2 className="text-2xl font-black uppercase mb-6">Comments</h2>
            <Giscus />
          </div>
        )}

        {/* Footer */}
        <footer className="border-t-8 border-black bg-white mt-20">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="font-bold">
              Built with frustration. Powered by collective rage.
            </p>
          </div>
        </footer>
        </div>
      </main>
    </>
  )
}
