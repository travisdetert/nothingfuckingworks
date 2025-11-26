'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Submission, urlFor } from '@/lib/sanity'
import MeTooModal from './MeTooModal'
import ModerationButtons from './ModerationButtons'

interface SubmissionCardProps {
  submission: Submission
}

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

const severityLabels: Record<string, string> = {
  trivial: '😐 Trivial',
  mild: '😠 Mild',
  moderate: '😤 Moderate',
  serious: '🤬 Serious',
  severe: '💀 Severe',
  critical: '☠️ Critical',
}

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  const [upvotes, setUpvotes] = useState(submission.upvotes)
  const [hasVoted, setHasVoted] = useState(false)
  const [showMeTooModal, setShowMeTooModal] = useState(false)

  const meToos = submission.meToos || []
  const times = meToos.map(m => m.timeWasted)

  const [meTooStats, setMeTooStats] = useState({
    totalIncidents: meToos.length,
    uniquePeople: new Set(meToos.map(m => m.submittedBy)).size,
    totalTime: times.reduce((sum, t) => sum + t, 0),
    minTime: times.length > 0 ? Math.min(...times) : 0,
    maxTime: times.length > 0 ? Math.max(...times) : 0,
    avgTime: times.length > 0 ? Math.round(times.reduce((sum, t) => sum + t, 0) / times.length) : 0,
  })

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
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upvote')
      }
    } catch (error) {
      console.error('Upvote failed:', error)
      alert('Failed to upvote')
    }
  }

  const handleMeTooSuccess = (stats: { totalIncidents: number; uniquePeople: number; totalTime: number; minTime: number; maxTime: number; avgTime: number }) => {
    setMeTooStats(stats)
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
        <Link href={`/post/${submission.slug.current}`}>
          <h2 className="text-2xl font-black uppercase hover:underline cursor-pointer mb-3">
            {submission.title}
          </h2>
        </Link>

        <div className="mb-3">
          <Link href={`/offenders/${encodeURIComponent(submission.company)}`}>
            <span className="text-lg font-bold text-red-600 hover:underline cursor-pointer">
              {submission.company}
            </span>
          </Link>
        </div>

        <p className="mb-4 text-gray-700">{submission.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {submission.category && (
            <span className="px-3 py-1 bg-black text-white font-bold text-xs uppercase">
              {categoryLabels[submission.category]}
            </span>
          )}
          <span className="px-3 py-1 bg-red-500 text-white font-bold text-xs uppercase">
            {severityLabels[submission.severity]}
          </span>
          {meTooStats.totalIncidents > 0 && (
            <>
              <span className="px-3 py-1 bg-blue-500 text-white font-bold text-xs uppercase">
                {meTooStats.minTime} min (min)
              </span>
              <span className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase">
                {meTooStats.avgTime} min (avg)
              </span>
              <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase">
                {meTooStats.maxTime} min (max)
              </span>
            </>
          )}
        </div>

        {/* Me Too Stats */}
        {meTooStats.totalIncidents > 0 && (
          <div className="mb-4 p-3 bg-gray-100 border-2 border-gray-300 text-sm">
            <div className="font-bold">
              👥 {meTooStats.uniquePeople} {meTooStats.uniquePeople === 1 ? 'person' : 'people'} •
              🔁 {meTooStats.totalIncidents} {meTooStats.totalIncidents === 1 ? 'incident' : 'incidents'} •
              ⏱️ {meTooStats.totalTime} min total
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 mb-3">
          <span>Submitted by {submission.submittedBy || 'Anonymous'}</span>
        </div>

        <button
          onClick={() => setShowMeTooModal(true)}
          className="w-full px-4 py-3 bg-yellow-400 text-black font-black uppercase text-base border-4 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all mb-3"
        >
          🤬 I am also fucking annoyed with this bullshit
        </button>

        <div className="flex items-center justify-between border-t-2 border-gray-200 pt-3">
          <button
            onClick={handleUpvote}
            disabled={hasVoted}
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-xs font-bold ${
              hasVoted
                ? 'bg-yellow-400 cursor-default'
                : 'bg-white hover:bg-yellow-400 cursor-pointer'
            }`}
          >
            <span className="text-base">🖕</span>
            <span>Upvote</span>
            {upvotes > 0 && <span className="ml-0.5">({upvotes})</span>}
          </button>
          <ModerationButtons submissionId={submission._id} initialDownvotes={submission.downvotes} />
        </div>
      </div>

      <MeTooModal
        isOpen={showMeTooModal}
        onClose={() => setShowMeTooModal(false)}
        submissionId={submission._id}
        submissionTitle={submission.title}
        onSuccess={handleMeTooSuccess}
      />
    </div>
  )
}
