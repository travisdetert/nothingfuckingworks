import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'

// Helper function to create slug from product name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper function to upsert product
async function upsertProduct(company: string, modelNumber?: string) {
  // Try to find existing product by company and model number
  const query = modelNumber
    ? `*[_type == "product" && company == $company && modelNumber == $modelNumber][0]`
    : `*[_type == "product" && company == $company && !defined(modelNumber)][0]`

  const existingProduct = await client.fetch(query, { company, modelNumber })

  if (existingProduct) {
    return existingProduct._id
  }

  // Create new product
  const productName = modelNumber ? `${company} ${modelNumber}` : company
  const slug = createSlug(productName)

  const newProduct = await writeClient.create({
    _type: 'product',
    name: productName,
    slug: { _type: 'slug', current: slug },
    company,
    modelNumber: modelNumber || undefined,
    productType: 'other', // Default, can be updated manually in Sanity
    discontinued: false,
  })

  return newProduct._id
}

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
    const modelNumber = formData.get('modelNumber') as string | null

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

    // Upsert product
    const productId = await upsertProduct(company, modelNumber || undefined)

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
      product: {
        _type: 'reference',
        _ref: productId,
      },
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
