import Link from 'next/link'
import SubmissionForm from '@/components/SubmissionForm'
import Header from '@/components/Header'

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-yellow-400">
      <Header />

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
