import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const title = formData.get('title') as string
    const company = formData.get('company') as string
    const description = formData.get('description') as string
    const timeWasted = parseInt(formData.get('timeWasted') as string)
    const primaryCategory = formData.get('primaryCategory') as string
    const subcategory = formData.get('subcategory') as string
    const severity = formData.get('severity') as string
    const submittedBy = formData.get('submittedBy') as string
    const screenshot = formData.get('screenshot') as File

    // Get tags array
    const tags = formData.getAll('tags[]') as string[]

    if (!title || !company || !description || !timeWasted || !primaryCategory || !subcategory || !severity || !screenshot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload image to Sanity
    const imageAsset = await writeClient.assets.upload('image', screenshot, {
      filename: screenshot.name,
    })

    // Create the submission document with initial meToo entry
    const submission = await writeClient.create({
      _type: 'submission',
      title,
      company,
      description,
      primaryCategory,
      subcategory,
      tags: tags.length > 0 ? tags : undefined,
      severity,
      submittedBy: submittedBy || 'Anonymous',
      screenshot: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      },
      meToos: [
        {
          _type: 'object',
          timeWasted,
          submittedBy: submittedBy || 'Anonymous',
          timestamp: new Date().toISOString(),
        },
      ],
      approved: false, // Requires manual approval
      upvotes: 0,
      publishedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        message: 'Submission received! It will be reviewed and published soon.',
        id: submission._id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    )
  }
}
