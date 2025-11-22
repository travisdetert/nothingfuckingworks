'use client'

import { useState } from 'react'
import MeTooModal from './MeTooModal'

interface MeTooButtonProps {
  submissionId: string
  submissionTitle: string
  initialMeToos?: Array<{ timeWasted: number; submittedBy: string; timestamp: string }>
}

export default function MeTooButton({ submissionId, submissionTitle, initialMeToos = [] }: MeTooButtonProps) {
  const [showMeTooModal, setShowMeTooModal] = useState(false)

  const meToos = initialMeToos || []
  const times = meToos.map(m => m.timeWasted)

  const [meTooStats, setMeTooStats] = useState({
    totalIncidents: meToos.length,
    uniquePeople: new Set(meToos.map(m => m.submittedBy)).size,
    totalTime: times.reduce((sum, t) => sum + t, 0),
    minTime: times.length > 0 ? Math.min(...times) : 0,
    maxTime: times.length > 0 ? Math.max(...times) : 0,
    avgTime: times.length > 0 ? Math.round(times.reduce((sum, t) => sum + t, 0) / times.length) : 0,
  })

  const handleMeTooSuccess = (stats: { totalIncidents: number; uniquePeople: number; totalTime: number; minTime: number; maxTime: number; avgTime: number }) => {
    setMeTooStats(stats)
  }

  return (
    <>
      <button
        onClick={() => setShowMeTooModal(true)}
        className="w-full px-6 py-4 bg-yellow-400 text-black font-black uppercase text-lg border-4 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        🤬 I am also fucking annoyed with this bullshit
      </button>

      {meTooStats.totalIncidents > 0 && (
        <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-600 text-center">
          <p className="font-bold text-lg">
            👥 {meTooStats.uniquePeople} {meTooStats.uniquePeople === 1 ? 'person' : 'people'} •
            🔁 {meTooStats.totalIncidents} {meTooStats.totalIncidents === 1 ? 'incident' : 'incidents'} •
            ⏱️ {meTooStats.totalTime} min total
          </p>
        </div>
      )}

      <MeTooModal
        isOpen={showMeTooModal}
        onClose={() => setShowMeTooModal(false)}
        submissionId={submissionId}
        submissionTitle={submissionTitle}
        onSuccess={handleMeTooSuccess}
      />
    </>
  )
}
