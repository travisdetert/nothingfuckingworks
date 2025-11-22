'use client'

import { useState, FormEvent } from 'react'
import { categoryHierarchy, getSubcategoriesForPrimary, tagLabels } from '@/lib/categories'

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')
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
        setMessage(data.message)
        form.reset()
        setSelectedPrimaryCategory('')
        setSelectedTags([])
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

  const subcategories = getSubcategoriesForPrimary(selectedPrimaryCategory)

  return (
    <div className="max-w-2xl mx-auto bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black mb-6 uppercase">
        Submit Your Broken Tech
      </h2>

      {message && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-600 text-green-800 font-bold">
          {message}
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
            placeholder="e.g., Microsoft Teams, iPhone 15, Tesla Model 3"
          />
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
            <option value="mild">😠 Mildly Annoying</option>
            <option value="moderate">🤬 Rage Inducing</option>
            <option value="severe">💀 Soul Crushing</option>
          </select>
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
