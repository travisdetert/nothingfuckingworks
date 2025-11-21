import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client, Submission } from '@/lib/sanity'
import SubmissionCard from '@/components/SubmissionCard'

interface PageProps {
  params: Promise<{ company: string }>
}

async function getSubmissionsByCompany(company: string): Promise<Submission[]> {
  const decodedCompany = decodeURIComponent(company)
  const query = `
    *[_type == "submission" && approved == true && company == $company] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      company,
      description,
      screenshot,
      timeWasted,
      category,
      severity,
      submittedBy,
      upvotes,
      approved,
      publishedAt
    }
  `
  return client.fetch(query, { company: decodedCompany })
}

async function getCompanyStats(company: string) {
  const submissions = await getSubmissionsByCompany(company)

  const totalTimeWasted = submissions.reduce((sum, s) => sum + (s.timeWasted || 0), 0)

  const severityValues: Record<string, number> = {
    mild: 1,
    moderate: 2,
    severe: 3,
  }

  const avgSeverity = submissions.length > 0
    ? submissions.reduce((sum, s) => sum + (severityValues[s.severity] || 1), 0) / submissions.length
    : 0

  return {
    totalSubmissions: submissions.length,
    totalTimeWasted,
    avgSeverity,
  }
}

export default async function CompanyOffenderPage({ params }: PageProps) {
  const { company } = await params
  const decodedCompany = decodeURIComponent(company)

  const submissions = await getSubmissionsByCompany(company)
  const stats = await getCompanyStats(company)

  if (submissions.length === 0) {
    notFound()
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
              href="/offenders"
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-yellow-400 transition-colors"
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
      <main className="container mx-auto px-4 py-12">
        {/* Company Header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
          <h2 className="text-5xl font-black uppercase mb-4 text-red-600">
            {decodedCompany}
          </h2>

          <div className="flex flex-wrap gap-4">
            <div className="bg-black text-white px-6 py-3 border-4 border-black font-black">
              <span className="text-3xl">{stats.totalSubmissions}</span>
              <span className="ml-2 text-sm uppercase">Complaints</span>
            </div>
            <div className="bg-red-500 text-white px-6 py-3 border-4 border-black font-black">
              <span className="text-3xl">{stats.totalTimeWasted.toLocaleString()}</span>
              <span className="ml-2 text-sm uppercase">Minutes Wasted</span>
            </div>
            <div className={`px-6 py-3 border-4 border-black font-black ${
              stats.avgSeverity >= 2.5 ? 'bg-red-600 text-white' :
              stats.avgSeverity >= 1.5 ? 'bg-orange-500 text-white' :
              'bg-yellow-400 text-black'
            }`}>
              <span className="text-2xl">
                {stats.avgSeverity >= 2.5 ? '💀' :
                 stats.avgSeverity >= 1.5 ? '🤬' :
                 '😠'}
              </span>
              <span className="ml-2 text-sm uppercase">
                {stats.avgSeverity >= 2.5 ? 'Soul Crushing' :
                 stats.avgSeverity >= 1.5 ? 'Rage Inducing' :
                 'Annoying'} Avg
              </span>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {submissions.map((submission) => (
            <SubmissionCard key={submission._id} submission={submission} />
          ))}
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
