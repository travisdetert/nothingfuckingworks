import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      )
    }

    // Get user ID from email
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]{ _id }`,
      { email }
    )

    if (!user) {
      return NextResponse.json({ submissions: [] })
    }

    // Fetch user's submissions
    const submissions = await client.fetch(
      `*[_type == "submission" && user._ref == $userId] | order(_createdAt desc) {
        _id,
        title,
        approved,
        _createdAt
      }`,
      { userId: user._id }
    )

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('User submissions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
