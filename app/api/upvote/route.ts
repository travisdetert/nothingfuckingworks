import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeClient, client } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Must be signed in to upvote' },
        { status: 401 }
      )
    }

    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID required' },
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

    // Check if user already upvoted
    const submission = await client.fetch(
      `*[_type == "submission" && _id == $id][0]{ upvotedBy[]->_id }`,
      { id: submissionId }
    )

    if (submission?.upvotedBy?.includes(sanityUser._id)) {
      return NextResponse.json(
        { error: 'Already upvoted' },
        { status: 400 }
      )
    }

    // Add user to upvotedBy array and increment upvotes
    const result = await writeClient
      .patch(submissionId)
      .inc({ upvotes: 1 })
      .setIfMissing({ upvotedBy: [] })
      .append('upvotedBy', [{ _type: 'reference', _ref: sanityUser._id, _key: `${sanityUser._id}-${Date.now()}` }])
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
