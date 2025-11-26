'use client'

import { useState } from 'react'

interface ModerationButtonsProps {
  submissionId: string
  initialDownvotes?: number
}

const flagReasons = [
  { value: 'whining', label: 'Just Whining' },
  { value: 'low-detail', label: 'Lacks Detail' },
  { value: 'spam', label: 'Spam/Duplicate' },
  { value: 'user-error', label: 'User Error' },
  { value: 'inappropriate', label: 'Inappropriate' },
  { value: 'fixed', label: 'Already Fixed' },
]

export default function ModerationButtons({ submissionId, initialDownvotes = 0 }: ModerationButtonsProps) {
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [hasDownvoted, setHasDownvoted] = useState(false)
  const [showFlagMenu, setShowFlagMenu] = useState(false)
  const [hasFlagged, setHasFlagged] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDownvote = async () => {
    if (hasDownvoted || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/downvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }),
      })

      if (response.ok) {
        const data = await response.json()
        setDownvotes(data.downvotes)
        setHasDownvoted(true)

        if (data.hiddenByModeration) {
          alert('This post has been hidden due to low quality score')
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to downvote')
      }
    } catch (error) {
      console.error('Downvote failed:', error)
      alert('Failed to downvote')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFlag = async (reason: string) => {
    if (hasFlagged || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          reason,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setHasFlagged(true)
        setShowFlagMenu(false)
        alert(data.message)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to flag submission')
      }
    } catch (error) {
      console.error('Flag failed:', error)
      alert('Failed to flag submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Downvote Button */}
      <button
        onClick={handleDownvote}
        disabled={hasDownvoted || isSubmitting}
        className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-xs font-bold ${
          hasDownvoted
            ? 'bg-gray-300 cursor-default'
            : 'bg-white hover:bg-red-100 cursor-pointer'
        }`}
        title="Downvote submission"
      >
        <span>👎</span>
        <span>Downvote submission</span>
        {downvotes > 0 && <span className="ml-0.5">({downvotes})</span>}
      </button>

      {/* Flag Button */}
      <div className="relative">
        <button
          onClick={() => setShowFlagMenu(!showFlagMenu)}
          disabled={hasFlagged || isSubmitting}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-xs font-bold ${
            hasFlagged
              ? 'bg-gray-300 cursor-default'
              : 'bg-white hover:bg-orange-100 cursor-pointer'
          }`}
          title="Flag for moderation"
        >
          <span>🚩</span>
          <span>{hasFlagged ? 'Flagged' : 'Flag'}</span>
        </button>

        {showFlagMenu && !hasFlagged && (
          <div className="absolute top-full left-0 mt-1 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 min-w-[200px]">
            <div className="p-2">
              <div className="text-xs font-bold mb-2 uppercase">Report Issue:</div>
              {flagReasons.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => handleFlag(reason.value)}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-yellow-400 font-bold"
                >
                  {reason.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
