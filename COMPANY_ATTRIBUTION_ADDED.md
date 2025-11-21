# Company Attribution Feature Added ✅

## What's New

The site now tracks which companies, products, or devices are responsible for broken tech!

### New Features

1. **Company/Product Field**
   - Required field in submission form
   - Displayed prominently on all submission cards
   - Clickable links to company-specific pages

2. **Worst Offenders Page** (`/offenders`)
   - Ranked list of companies by total time wasted
   - Shows complaint count and average severity for each company
   - Click any company to see all their submissions

3. **Individual Company Pages** (`/offenders/[company]`)
   - Detailed stats for each company:
     - Total complaints
     - Total time wasted
     - Average severity level
   - Grid of all submissions for that company
   - Color-coded severity indicators

### Navigation Updates

All pages now have a "Worst Offenders" link in the navigation bar.

### How It Works

#### Submission Flow
1. User fills out form including "Company/Product/Device" field
2. Examples: "Microsoft Teams", "iPhone 15", "Tesla Model 3"
3. Submission is created with company attribution

#### Aggregation
- Companies are automatically aggregated by exact name match
- Stats calculated in real-time:
  - Total submissions per company
  - Total time wasted (sum of all submissions)
  - Average severity (weighted by all submissions)

#### Severity Levels
- 😠 **Annoying** (avg < 1.5)
- 🤬 **Rage Inducing** (avg 1.5-2.5)
- 💀 **Soul Crushing** (avg > 2.5)

### Pages Updated

1. **`/`** (Homepage)
   - Added company name below title on submission cards
   - Updated navigation with Worst Offenders link

2. **`/submit`** (Submission Form)
   - Added Company/Product/Device field (required)
   - Updated navigation

3. **`/post/[slug]`** (Post Detail)
   - Added prominent company name display
   - Company name links to offender page
   - Updated navigation

4. **`/offenders`** (NEW)
   - Hall of Shame ranking
   - Sorted by total time wasted

5. **`/offenders/[company]`** (NEW)
   - Company-specific stats and submissions

### Schema Changes

Added to `sanity/schema.ts`:
```typescript
{
  name: 'company',
  title: 'Company/Product/Device',
  type: 'string',
  description: 'The company, application, or device responsible for this mess',
  validation: (Rule) => Rule.required(),
}
```

### TypeScript Interface

Updated `Submission` interface in `lib/sanity.ts`:
```typescript
export interface Submission {
  // ...
  company: string
  // ...
}
```

### API Updates

- `/api/submit` now requires and stores `company` field
- All GROQ queries updated to include `company`

## Important Notes

### For Existing Data

If you have existing submissions in Sanity that were created before this update:
1. They won't appear until you add a `company` value
2. Edit them in Sanity Studio (`/studio`)
3. Add a company name to each submission
4. They'll then appear on the site

### For New Submissions

All new submissions require a company/product/device name - the form validation enforces this.

## Testing the Feature

1. Go to http://localhost:3000/submit
2. Fill out the form with a company name (e.g., "Microsoft Teams")
3. Submit it (note: you need `SANITY_API_TOKEN` configured)
4. Approve it in Sanity Studio
5. Visit http://localhost:3000/offenders to see it ranked
6. Click the company name to see the detail page

## Future Enhancements

Possible improvements:
- Company name normalization (e.g., "MS Teams" = "Microsoft Teams")
- Search/filter on offenders page
- Charts/graphs showing trends
- Export data as CSV
- Company logos/icons
