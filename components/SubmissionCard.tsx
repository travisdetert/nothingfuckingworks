'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Submission, urlFor } from '@/lib/sanity'

interface SubmissionCardProps {
  submission: Submission
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

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  const [upvotes, setUpvotes] = useState(submission.upvotes)
  const [hasVoted, setHasVoted] = useState(false)

  const handleUpvote = async () => {
    if (hasVoted) return

    try {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: submission._id }),
      })

      if (response.ok) {
        const data = await response.json()
        setUpvotes(data.upvotes)
        setHasVoted(true)
      }
    } catch (error) {
      console.error('Upvote failed:', error)
    }
  }

  const imageUrl = urlFor(submission.screenshot).width(800).height(600).url()

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <Link href={`/post/${submission.slug.current}`}>
        <div className="relative aspect-video overflow-hidden border-b-4 border-black cursor-pointer hover:opacity-90 transition-opacity">
          <Image
            src={imageUrl}
            alt={submission.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <Link href={`/post/${submission.slug.current}`}>
            <h2 className="text-2xl font-black uppercase hover:underline cursor-pointer">
              {submission.title}
            </h2>
          </Link>

          <button
            onClick={handleUpvote}
            disabled={hasVoted}
            className={`flex flex-col items-center gap-1 px-4 py-2 border-2 border-black font-bold min-w-[70px] ${
              hasVoted
                ? 'bg-yellow-400 cursor-default'
                : 'bg-white hover:bg-yellow-400 cursor-pointer'
            }`}
          >
            <span className="text-2xl">👍</span>
            <span className="text-sm">{upvotes}</span>
          </button>
        </div>

        <div className="mb-4">
          <Link href={`/offenders/${encodeURIComponent(submission.company)}`}>
            <span className="text-lg font-bold text-red-600 hover:underline cursor-pointer">
              {submission.company}
            </span>
          </Link>
        </div>

        <p className="mb-4 text-gray-700">{submission.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-black text-white font-bold text-xs uppercase">
            {categoryLabels[submission.category]}
          </span>
          <span className="px-3 py-1 bg-red-500 text-white font-bold text-xs uppercase">
            {severityLabels[submission.severity]}
          </span>
          <span className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase">
            {submission.timeWasted} min wasted
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <span>Submitted by {submission.submittedBy || 'Anonymous'}</span>
        </div>
      </div>
    </div>
  )
}
