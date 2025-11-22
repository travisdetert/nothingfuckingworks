import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'Official product name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company/Manufacturer',
      type: 'string',
      description: 'The company that makes this product',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modelNumber',
      title: 'Model Number',
      type: 'string',
      description: 'Official model number (e.g., iPhone 15 Pro, Model 3, Surface Pro 9)',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit / Product SKU',
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Software/firmware version if applicable',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      description: 'When this product was released',
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Software Application', value: 'software' },
          { title: 'Mobile App', value: 'mobile-app' },
          { title: 'Web Service', value: 'web-service' },
          { title: 'Hardware Device', value: 'hardware' },
          { title: 'Smart Home Device', value: 'smart-home' },
          { title: 'Vehicle', value: 'vehicle' },
          { title: 'Appliance', value: 'appliance' },
          { title: 'Gaming Console', value: 'gaming' },
          { title: 'Wearable', value: 'wearable' },
          { title: 'Computer/Laptop', value: 'computer' },
          { title: 'Phone/Tablet', value: 'mobile-device' },
          { title: 'Operating System', value: 'operating-system' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the product',
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Product photo or logo',
    }),
    defineField({
      name: 'officialWebsite',
      title: 'Official Website',
      type: 'url',
      description: 'Link to product page or company website',
    }),
    defineField({
      name: 'supportUrl',
      title: 'Support URL',
      type: 'url',
      description: 'Link to customer support or help center',
    }),
    defineField({
      name: 'discontinued',
      title: 'Discontinued',
      type: 'boolean',
      initialValue: false,
      description: 'Is this product no longer available?',
    }),
    defineField({
      name: 'totalIssues',
      title: 'Total Issues',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Auto-calculated count of submissions',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'company',
      modelNumber: 'modelNumber',
      media: 'image',
      discontinued: 'discontinued',
    },
    prepare({ title, subtitle, modelNumber, media, discontinued }) {
      return {
        title: `${discontinued ? '🚫 ' : ''}${title}${modelNumber ? ` (${modelNumber})` : ''}`,
        subtitle: subtitle,
        media: media,
      }
    },
  },
})
