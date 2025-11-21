import { defineField, defineType } from 'sanity'

export const submission = defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company/Product/Device',
      type: 'string',
      description: 'The company, application, or device responsible for this mess',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'screenshot',
      title: 'Screenshot',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timeWasted',
      title: 'Time Wasted (minutes)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Software/Apps', value: 'software' },
          { title: 'Website/Web Service', value: 'website' },
          { title: 'Hardware/Device', value: 'hardware' },
          { title: 'Operating System', value: 'os' },
          { title: 'Smart Home/IoT', value: 'iot' },
          { title: 'Payment/Banking', value: 'payment' },
          { title: 'Transportation', value: 'transportation' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'severity',
      title: 'Severity',
      type: 'string',
      options: {
        list: [
          { title: '😠 Mildly Annoying', value: 'mild' },
          { title: '🤬 Rage Inducing', value: 'moderate' },
          { title: '💀 Soul Crushing', value: 'severe' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedBy',
      title: 'Submitted By',
      type: 'string',
    }),
    defineField({
      name: 'upvotes',
      title: 'Upvotes',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Approve this submission to make it visible on the site',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'screenshot',
      company: 'company',
      approved: 'approved',
    },
    prepare(selection) {
      const { title, company, approved } = selection
      return {
        title: `${approved ? '✅' : '⏳'} ${title}`,
        subtitle: company,
        media: selection.media,
      }
    },
  },
})

export const schemaTypes = [submission]
