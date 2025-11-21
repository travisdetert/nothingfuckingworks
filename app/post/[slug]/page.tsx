import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor, Submission } from '@/lib/sanity'
import Giscus from '@/components/Giscus'

interface PageProps {
  params: Promise<{ slug: string }>
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
      timeWasted,
      category,
      severity,
      submittedBy,
      upvotes,
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
              href="/submit"
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase hover:bg-white transition-colors"
            >
              Submit Your Pain
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden border-b-4 border-black">
            <Image
              src={imageUrl}
              alt={submission.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-4xl font-black uppercase mb-4">
              {submission.title}
            </h1>

            <div className="mb-6">
              <Link href={`/offenders/${encodeURIComponent(submission.company)}`}>
                <span className="text-2xl font-bold text-red-600 hover:underline cursor-pointer">
                  {submission.company}
                </span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 bg-black text-white font-bold text-sm uppercase">
                {categoryLabels[submission.category]}
              </span>
              <span className="px-4 py-2 bg-red-500 text-white font-bold text-sm uppercase">
                {severityLabels[submission.severity]}
              </span>
              <span className="px-4 py-2 bg-yellow-400 text-black font-bold text-sm uppercase">
                {submission.timeWasted} minutes wasted
              </span>
              <span className="px-4 py-2 border-2 border-black font-bold text-sm uppercase">
                👍 {submission.upvotes}
              </span>
            </div>

            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-xl leading-relaxed">{submission.description}</p>
            </div>

            <div className="border-t-2 border-black pt-6">
              <p className="text-sm text-gray-600">
                Submitted by <span className="font-bold">{submission.submittedBy || 'Anonymous'}</span> on{' '}
                {new Date(submission.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        {process.env.NEXT_PUBLIC_GISCUS_REPO && (
          <div className="mt-12 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <h2 className="text-2xl font-black uppercase mb-6">Comments</h2>
            <Giscus />
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
