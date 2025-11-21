import Link from 'next/link'
import { client } from '@/lib/sanity'
import { Submission } from '@/lib/sanity'
import SubmissionCard from '@/components/SubmissionCard'

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
      timeWasted,
      category,
      severity,
      submittedBy,
      upvotes,
      approved,
      publishedAt
    }
  `
  return client.fetch(query)
}

async function getTotalStats() {
  const submissions = await client.fetch<Submission[]>(
    `*[_type == "submission" && approved == true]{ timeWasted }`
  )

  const totalTimeWasted = submissions.reduce((sum, s) => sum + (s.timeWasted || 0), 0)

  return {
    totalSubmissions: submissions.length,
    totalTimeWasted
  }
}

export default async function Home() {
  const submissions = await getSubmissions()
  const stats = await getTotalStats()

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="border-b-8 border-black bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase text-center mb-4">
            Nothing Fucking Works
          </h1>
          <p className="text-xl text-center font-bold">
            A collection of broken tech wasting everyone&apos;s time
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-black text-white px-6 py-3 border-4 border-black font-black">
              <span className="text-3xl">{stats.totalSubmissions}</span>
              <span className="ml-2 text-sm uppercase">Broken Things</span>
            </div>
            <div className="bg-red-500 text-white px-6 py-3 border-4 border-black font-black">
              <span className="text-3xl">{stats.totalTimeWasted?.toLocaleString()}</span>
              <span className="ml-2 text-sm uppercase">Minutes Wasted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black text-white border-b-4 border-black sticky top-0 z-10">
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
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase hover:bg-white transition-colors"
            >
              Submit Your Pain
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
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
