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
      name: 'product',
      title: 'Product (Optional)',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Link to a specific product (SKU/Model)',
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
      name: 'primaryCategory',
      title: 'Primary Category',
      type: 'string',
      options: {
        list: [
          { title: '💻 Digital Software', value: 'digital-software' },
          { title: '🔧 Hardware & Devices', value: 'hardware-devices' },
          { title: '🚗 Transportation & Automotive', value: 'transportation-auto' },
          { title: '🏠 Home & Living', value: 'home-living' },
          { title: '🏢 Enterprise & Business', value: 'enterprise-business' },
          { title: '🎮 Entertainment & Media', value: 'entertainment-media' },
          { title: '🏥 Healthcare & Wellness', value: 'healthcare-wellness' },
          { title: '🎓 Education & Learning', value: 'education-learning' },
          { title: '🏛️ Government & Public Services', value: 'government-public' },
          { title: '💳 Finance & Commerce', value: 'finance-commerce' },
          { title: '🌐 Infrastructure & Utilities', value: 'infrastructure-utilities' },
          { title: '📱 Mobile & Wearables', value: 'mobile-wearables' },
          { title: '🤝 Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      description: 'Specific type within the primary category',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '🔒 Privacy Violation', value: 'privacy-violation' },
          { title: '💾 Data Loss', value: 'data-loss' },
          { title: '♿ Accessibility Fail', value: 'accessibility-fail' },
          { title: '🐌 Performance Issue', value: 'performance-issue' },
          { title: '🔐 Security Flaw', value: 'security-flaw' },
          { title: '💸 Money Wasted', value: 'money-wasted' },
          { title: '🎨 UX Nightmare', value: 'ux-nightmare' },
          { title: '📞 No Support', value: 'no-support' },
          { title: '🔄 Forced Update', value: 'forced-update' },
          { title: '🪲 Known Bug Ignored', value: 'known-bug-ignored' },
          { title: '🔌 Incompatibility', value: 'incompatibility' },
          { title: '📵 Offline Broken', value: 'offline-broken' },
          { title: '🎯 Dark Pattern', value: 'dark-pattern' },
          { title: '🔊 Notification Spam', value: 'notification-spam' },
          { title: '⚠️ Safety Issue', value: 'safety-issue' },
          { title: '🌍 Regional Lock', value: 'regional-lock' },
          { title: '💰 Hidden Cost', value: 'hidden-cost' },
          { title: '🔒 Vendor Lock-in', value: 'vendor-lockin' },
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Legacy Category (deprecated)',
      type: 'string',
      description: 'Old category field - will be migrated',
      hidden: true,
    }),
    defineField({
      name: 'severity',
      title: 'Severity',
      type: 'string',
      options: {
        list: [
          { title: '😐 Trivial - Minor inconvenience', value: 'trivial' },
          { title: '😠 Mild - Annoying but workable', value: 'mild' },
          { title: '😤 Moderate - Frustrating issue', value: 'moderate' },
          { title: '🤬 Serious - Rage inducing', value: 'serious' },
          { title: '💀 Severe - Soul crushing', value: 'severe' },
          { title: '☠️ Critical - Completely broken', value: 'critical' },
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
      name: 'meToos',
      title: 'Me Too Reports',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'timeWasted',
              title: 'Time Wasted (minutes)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'submittedBy',
              title: 'Submitted By',
              type: 'string',
              initialValue: 'Anonymous',
            },
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
              initialValue: () => new Date().toISOString(),
            },
          ],
          preview: {
            select: {
              submittedBy: 'submittedBy',
              timeWasted: 'timeWasted',
              timestamp: 'timestamp',
            },
            prepare({ submittedBy, timeWasted, timestamp }) {
              return {
                title: `${submittedBy || 'Anonymous'} - ${timeWasted} min`,
                subtitle: new Date(timestamp).toLocaleDateString(),
              }
            },
          },
        },
      ],
      initialValue: [],
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

export const schemaTypes = [product, submission]
