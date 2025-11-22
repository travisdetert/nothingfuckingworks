import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const { submissionId, timeWasted, submittedBy } = await request.json()

    if (!submissionId || !timeWasted) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the Me Too entry
    const meTooEntry = {
      timeWasted: parseInt(timeWasted),
      submittedBy: submittedBy || 'Anonymous',
      timestamp: new Date().toISOString(),
    }

    // Add to the meToos array using Sanity's array append operation
    const result = await writeClient
      .patch(submissionId)
      .setIfMissing({ meToos: [] })
      .append('meToos', [meTooEntry])
      .commit()

    // Calculate stats
    const meToos = result.meToos || []
    const times = meToos.map((m: any) => m.timeWasted || 0)
    const totalIncidents = meToos.length
    const uniquePeople = new Set(meToos.map((m: any) => m.submittedBy)).size
    const totalTime = times.reduce((sum: number, t: number) => sum + t, 0)
    const minTime = times.length > 0 ? Math.min(...times) : 0
    const maxTime = times.length > 0 ? Math.max(...times) : 0
    const avgTime = times.length > 0 ? Math.round(totalTime / times.length) : 0

    return NextResponse.json({
      message: 'Me Too added successfully!',
      stats: {
        totalIncidents,
        uniquePeople,
        totalTime,
        minTime,
        maxTime,
        avgTime,
      },
    })
  } catch (error) {
    console.error('Me Too error:', error)
    return NextResponse.json(
      { error: 'Failed to add Me Too. Please try again.' },
      { status: 500 }
    )
  }
}
