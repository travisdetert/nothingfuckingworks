'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { categoryHierarchy, getSubcategoriesForPrimary, tagLabels } from '@/lib/categories'

interface SubmissionData {
  id: string
  title: string
  company: string
  description: string
  severity: string
  primaryCategory: string
  subcategory: string
}

interface UserSubmission {
  _id: string
  title: string
  approved: boolean
  _createdAt: string
}

export default function SubmissionForm() {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submittedData, setSubmittedData] = useState<SubmissionData | null>(null)
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([])

  // Fetch user's previous submissions if logged in
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/user-submissions?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.submissions) {
            setUserSubmissions(data.submissions)
          }
        })
        .catch(err => console.error('Failed to fetch user submissions:', err))
    }
  }, [session])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add selected tags to formData
    selectedTags.forEach(tag => {
      formData.append('tags[]', tag)
    })

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // Store submission data for success view
        setSubmittedData({
          id: data.id,
          title: formData.get('title') as string,
          company: formData.get('company') as string,
          description: formData.get('description') as string,
          severity: formData.get('severity') as string,
          primaryCategory: formData.get('primaryCategory') as string,
          subcategory: formData.get('subcategory') as string,
        })

        // Refresh user submissions list
        if (session?.user?.email) {
          const subsResponse = await fetch(`/api/user-submissions?email=${encodeURIComponent(session.user.email)}`)
          const subsData = await subsResponse.json()
          if (subsData.submissions) {
            setUserSubmissions(subsData.submissions)
          }
        }
      } else {
        setError(data.error || 'Submission failed')
      }
    } catch (err) {
      console.error('Submission error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmitAnother = () => {
    setSubmittedData(null)
    setSelectedPrimaryCategory('')
    setSelectedTags([])
  }

  const subcategories = getSubcategoriesForPrimary(selectedPrimaryCategory)
  const severityLabels: Record<string, string> = {
    trivial: 'Trivial - Minor inconvenience',
    mild: 'Mild - Annoying but workable',
    moderate: 'Moderate - Frustrating issue',
    serious: 'Serious - Rage inducing',
    severe: 'Severe - Soul crushing',
    critical: 'Critical - Completely broken',
  }

  // Show success view after submission
  if (submittedData) {
    const category = categoryHierarchy.find(c => c.value === submittedData.primaryCategory)
    const sub = category?.subcategories.find(s => s.value === submittedData.subcategory)

    return (
      <div className="max-w-2xl mx-auto bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-400 border-4 border-black px-6 py-3 mb-4">
            <h2 className="text-2xl font-black uppercase">Submitted for Approval!</h2>
          </div>
          <p className="text-lg">Your submission will be reviewed and published soon.</p>
        </div>

        <div className="bg-gray-50 border-2 border-black p-6 mb-6">
          <h3 className="font-black uppercase text-lg mb-4">Submission Summary</h3>

          <div className="space-y-3">
            <div>
              <span className="font-bold text-sm uppercase">Title:</span>
              <p className="text-lg">{submittedData.title}</p>
            </div>

            <div>
              <span className="font-bold text-sm uppercase">Company:</span>
              <p>{submittedData.company}</p>
            </div>

            <div>
              <span className="font-bold text-sm uppercase">Description:</span>
              <p className="text-gray-700">{submittedData.description}</p>
            </div>

            <div className="flex gap-4">
              <div>
                <span className="font-bold text-sm uppercase">Category:</span>
                <p>{category?.emoji} {category?.label}</p>
              </div>
              <div>
                <span className="font-bold text-sm uppercase">Subcategory:</span>
                <p>{sub?.label}</p>
              </div>
            </div>

            <div>
              <span className="font-bold text-sm uppercase">Severity:</span>
              <p>{severityLabels[submittedData.severity]}</p>
            </div>
          </div>
        </div>

        {session && userSubmissions.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-600 p-6 mb-6">
            <h3 className="font-black uppercase text-lg mb-4">Your Submissions</h3>
            <div className="space-y-2">
              {userSubmissions.map(sub => (
                <div key={sub._id} className="flex items-center justify-between p-3 bg-white border border-gray-300">
                  <div className="flex-1">
                    <p className="font-bold">{sub.title}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(sub._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 text-xs font-bold ${
                    sub.approved
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-400 text-black'
                  }`}>
                    {sub.approved ? 'APPROVED' : 'PENDING'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSubmitAnother}
            className="flex-1 bg-black text-white font-black uppercase py-3 px-6 border-4 border-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Submit Another
          </button>
          <Link
            href="/"
            className="flex-1 bg-white text-black font-black uppercase py-3 px-6 border-4 border-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
          >
            Back Home
          </Link>
        </div>
      </div>
    )
  }

  // Show form
  return (
    <div className="max-w-2xl mx-auto bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black mb-6 uppercase">
        Submit Your Broken Tech
      </h2>

      {session && (
        <div className="mb-6 p-4 bg-blue-100 border-2 border-blue-600">
          <p className="font-bold">
            Logged in as: {session.user?.name || session.user?.email}
          </p>
          <p className="text-sm text-gray-700">Your submission will be attributed to your account.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-600 text-red-800 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-bold mb-2 uppercase text-sm">
            What broke?
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            placeholder="e.g., Microsoft Teams won't let me unmute"
          />
        </div>

        <div>
          <label htmlFor="company" className="block font-bold mb-2 uppercase text-sm">
            Company/Product/Device
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            placeholder="e.g., Microsoft, Apple, Tesla"
          />
        </div>

        <div>
          <label htmlFor="modelNumber" className="block font-bold mb-2 uppercase text-sm">
            Model/Version Number (Optional)
          </label>
          <input
            type="text"
            id="modelNumber"
            name="modelNumber"
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            placeholder="e.g., iPhone 15 Pro, Model 3, Windows 11, v2.5.1"
          />
          <p className="text-xs text-gray-600 mt-1">
            Specify the exact model, version, or SKU if applicable
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block font-bold mb-2 uppercase text-sm">
            Tell us what happened
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            placeholder="Describe the pain and suffering..."
          />
        </div>

        <div>
          <label htmlFor="screenshot" className="block font-bold mb-2 uppercase text-sm">
            Screenshot (Required)
          </label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            accept="image/*"
            required
            className="w-full p-3 border-2 border-black bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-black file:text-white file:font-bold file:uppercase file:cursor-pointer hover:file:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="timeWasted" className="block font-bold mb-2 uppercase text-sm">
            Time Wasted (minutes)
          </label>
          <input
            type="number"
            id="timeWasted"
            name="timeWasted"
            required
            min="0"
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            placeholder="30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="primaryCategory" className="block font-bold mb-2 uppercase text-sm">
              Primary Category
            </label>
            <select
              id="primaryCategory"
              name="primaryCategory"
              required
              value={selectedPrimaryCategory}
              onChange={(e) => setSelectedPrimaryCategory(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white"
            >
              <option value="">Select primary category...</option>
              {categoryHierarchy.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subcategory" className="block font-bold mb-2 uppercase text-sm">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              required
              disabled={!selectedPrimaryCategory}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedPrimaryCategory ? 'Select subcategory...' : 'Select primary first...'}
              </option>
              {subcategories.map(sub => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 uppercase text-sm">
            Tags (Optional - Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tagLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTagToggle(value)}
                className={`px-3 py-2 text-xs font-bold border-2 border-black transition-colors ${
                  selectedTags.includes(value)
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="severity" className="block font-bold mb-2 uppercase text-sm">
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            required
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white"
          >
            <option value="">Select...</option>
            <option value="trivial">😐 Trivial - Minor inconvenience</option>
            <option value="mild">😠 Mild - Annoying but workable</option>
            <option value="moderate">😤 Moderate - Frustrating issue</option>
            <option value="serious">🤬 Serious - Rage inducing</option>
            <option value="severe">💀 Severe - Soul crushing</option>
            <option value="critical">☠️ Critical - Completely broken</option>
          </select>
        </div>

        {!session && (
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
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-black uppercase py-4 px-6 border-4 border-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Your Pain'}
        </button>
      </form>
    </div>
  )
}
