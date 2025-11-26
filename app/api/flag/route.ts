import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeClient, client } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Must be signed in to flag' },
        { status: 401 }
      )
    }

    const { submissionId, reason } = await request.json()

    if (!submissionId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user ID from Sanity
    const sanityUser = await client.fetch(
      `*[_type == "user" && email == $email][0]{ _id }`,
      { email: session.user.email }
    )

    if (!sanityUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get current submission and check if user already flagged
    const submission = await client.fetch(
      `*[_type == "submission" && _id == $submissionId][0]{ upvotes, downvotes, flags }`,
      { submissionId }
    )

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Check if user already flagged this submission
    const alreadyFlagged = submission.flags?.some((flag: any) =>
      flag.user?._ref === sanityUser._id
    )

    if (alreadyFlagged) {
      return NextResponse.json(
        { error: 'Already flagged this submission' },
        { status: 400 }
      )
    }

    // Add the flag
    const newFlag = {
      _key: `${sanityUser._id}-${Date.now()}`,
      _type: 'object',
      reason,
      user: { _type: 'reference', _ref: sanityUser._id },
      timestamp: new Date().toISOString(),
    }

    const flags = [...(submission.flags || []), newFlag]

    // Calculate quality score: upvotes - downvotes - (flags * 2)
    const qualityScore = (submission.upvotes || 0) - (submission.downvotes || 0) - (flags.length * 2)

    // Auto-hide if quality score drops below -5 OR has 3+ "whining" flags
    const whiningFlags = flags.filter(f => f.reason === 'whining').length
    const hiddenByModeration = qualityScore < -5 || whiningFlags >= 3

    // Update the submission
    await writeClient
      .patch(submissionId)
      .set({
        flags,
        qualityScore,
        hiddenByModeration
      })
      .commit()

    return NextResponse.json({
      flags: flags.length,
      qualityScore,
      hiddenByModeration,
      message: hiddenByModeration
        ? 'Post flagged and hidden due to low quality'
        : 'Post flagged successfully'
    })
  } catch (error) {
    console.error('Flag error:', error)
    return NextResponse.json(
      { error: 'Failed to flag post' },
      { status: 500 }
    )
  }
}
