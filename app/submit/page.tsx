import Link from 'next/link'
import SubmissionForm from '@/components/SubmissionForm'

export default function SubmitPage() {
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
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase"
            >
              Submit Your Pain
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <SubmissionForm />
      </main>

      {/* Footer */}
      <footer className="border-t-8 border-black bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-bold">
            Your submission will be reviewed before appearing on the site.
          </p>
        </div>
      </footer>
    </div>
  )
}
