import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export interface MeTooEntry {
  timeWasted: number
  submittedBy: string
  timestamp: string
}

export interface Submission {
  _id: string
  _createdAt: string
  title: string
  slug: { current: string }
  company: string
  description: string
  screenshot: {
    asset: {
      _ref: string
      _type: string
    }
  }
  category?: string // legacy field
  primaryCategory: string
  subcategory: string
  tags?: string[]
  severity: string
  submittedBy?: string
  upvotes: number
  meToos?: MeTooEntry[]
  approved: boolean
  publishedAt: string
}
