'use client'

import { useState, FormEvent } from 'react'

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        e.currentTarget.reset()
      } else {
        setError(data.error || 'Submission failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label htmlFor="category" className="block font-bold mb-2 uppercase text-sm">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white"
            >
              <option value="">Select...</option>
              <option value="software">Software/Apps</option>
              <option value="website">Website/Web Service</option>
              <option value="hardware">Hardware/Device</option>
              <option value="os">Operating System</option>
              <option value="iot">Smart Home/IoT</option>
              <option value="payment">Payment/Banking</option>
              <option value="transportation">Transportation</option>
              <option value="other">Other</option>
            </select>
          </div>
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
