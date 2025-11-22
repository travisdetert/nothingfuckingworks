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

export const schemaTypes = [submission]
