import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID required' },
        { status: 400 }
      )
    }

    // Increment upvotes
    const result = await writeClient
      .patch(submissionId)
      .inc({ upvotes: 1 })
      .commit()

    return NextResponse.json({ upvotes: result.upvotes })
  } catch (error) {
    console.error('Upvote error:', error)
    return NextResponse.json(
      { error: 'Failed to upvote' },
      { status: 500 }
    )
  }
}
