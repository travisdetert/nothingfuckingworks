'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface MeTooModalProps {
  isOpen: boolean
  onClose: () => void
  submissionId: string
  submissionTitle: string
  onSuccess: (stats: { totalIncidents: number; uniquePeople: number; totalTime: number; minTime: number; maxTime: number; avgTime: number }) => void
}

export default function MeTooModal({
  isOpen,
  onClose,
  submissionId,
  submissionTitle,
  onSuccess,
}: MeTooModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const timeWasted = formData.get('timeWasted')
    const submittedBy = formData.get('submittedBy')

    try {
      const response = await fetch('/api/metoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          timeWasted,
          submittedBy: submittedBy || 'Anonymous',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to submit')
        setIsSubmitting(false)
        return
      }

      const data = await response.json()
      onSuccess(data.stats)
      onClose()

      // Add a small delay to let Sanity sync, then refresh
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (err) {
      setError('Network error. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
        <div className="bg-yellow-400 border-b-4 border-black p-4">
          <h2 className="text-2xl font-black uppercase">🤬 I'm Fucking Annoyed Too!</h2>
        </div>

        <div className="p-6">
          <p className="mb-4 font-bold">
            This bullshit happened to you too? Add your wasted time:
          </p>
          <p className="mb-6 text-sm bg-gray-100 p-3 border-2 border-black">
            {submissionTitle}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-800 font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="timeWasted" className="block font-bold mb-2 uppercase text-sm">
                Time Wasted (minutes) *
              </label>
              <input
                type="number"
                id="timeWasted"
                name="timeWasted"
                required
                min="0"
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
                placeholder="30"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="submittedBy" className="block font-bold mb-2 uppercase text-sm">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="submittedBy"
                name="submittedBy"
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
                placeholder="Anonymous"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-black text-white font-black uppercase py-3 px-4 border-4 border-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Me Too'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-white text-black font-black uppercase py-3 px-4 border-4 border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
