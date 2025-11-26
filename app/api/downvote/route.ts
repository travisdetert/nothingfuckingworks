import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeClient, client } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Must be signed in to downvote' },
        { status: 401 }
      )
    }

    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submission ID' },
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

    // Get current submission
    const submission = await client.fetch(
      `*[_type == "submission" && _id == $submissionId][0]{ downvotes, downvotedBy[]->_id, upvotes, flags }`,
      { submissionId }
    )

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Check if user already downvoted
    if (submission?.downvotedBy?.includes(sanityUser._id)) {
      return NextResponse.json(
        { error: 'Already downvoted' },
        { status: 400 }
      )
    }

    const newDownvotes = (submission.downvotes || 0) + 1

    // Calculate quality score: upvotes - downvotes - (flags * 2)
    const flagCount = submission.flags?.length || 0
    const qualityScore = (submission.upvotes || 0) - newDownvotes - (flagCount * 2)

    // Auto-hide if quality score drops below -5
    const hiddenByModeration = qualityScore < -5

    // Update the submission
    await writeClient
      .patch(submissionId)
      .set({
        downvotes: newDownvotes,
        qualityScore,
        hiddenByModeration
      })
      .setIfMissing({ downvotedBy: [] })
      .append('downvotedBy', [{ _type: 'reference', _ref: sanityUser._id, _key: `${sanityUser._id}-${Date.now()}` }])
      .commit()

    return NextResponse.json({
      downvotes: newDownvotes,
      qualityScore,
      hiddenByModeration
    })
  } catch (error) {
    console.error('Downvote error:', error)
    return NextResponse.json(
      { error: 'Failed to downvote' },
      { status: 500 }
    )
  }
}
