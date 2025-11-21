# Nothing Fucking Works

A user-submitted blog showcasing broken tech, frustrating experiences, and the collective time wasted on malfunctioning software and devices.

## Tech Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend/CMS:** Sanity.io (headless CMS)
- **Comments:** Giscus (GitHub Discussions)
- **Deployment:** Vercel (recommended)

## Features

- ✅ User submission form with screenshot upload
- ✅ Approval workflow (submissions require approval before going live)
- ✅ Upvote system
- ✅ Time wasted tracking
- ✅ Category and severity tagging
- ✅ GitHub-based comments via Giscus
- ✅ Responsive design with bold, high-contrast styling
- ✅ Built-in Sanity Studio at `/studio`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Sanity

1. Create a free Sanity account at [sanity.io](https://www.sanity.io)
2. Run the Sanity CLI to create a project:

```bash
npx sanity init --project-plan free
```

3. When prompted:
   - Select "Create new project"
   - Choose a name for your project
   - Use the default dataset configuration (production)
   - Answer "N" to using a template

4. Get your Project ID:
   - Find it at https://www.sanity.io/manage
   - Or run: `npx sanity manage`

5. Create an API token with Editor permissions:
   - Go to https://www.sanity.io/manage
   - Navigate to: Your Project → API → Tokens
   - Click "Add API token"
   - Name it (e.g., "Production")
   - Set permissions to "Editor"
   - Copy the token (you won't see it again!)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
```

### 4. Configure CORS for Sanity

1. Go to https://www.sanity.io/manage
2. Select your project → API → CORS Origins
3. Add your domains:
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://nothingfuckingworks.com`)
4. Check "Allow credentials"

### 5. Set Up Giscus Comments (Optional)

1. Create a public GitHub repository for your site (or use an existing one)
2. Install the Giscus app: https://github.com/apps/giscus
3. Enable Discussions on your repo:
   - Go to repo Settings → General → Features
   - Check "Discussions"
4. Go to https://giscus.app and configure:
   - Enter your repository (e.g., `username/nothingfuckingworks`)
   - Choose a Discussion Category (e.g., "General" or create "Comments")
   - Copy the generated values

5. Add to `.env.local`:

```env
NEXT_PUBLIC_GISCUS_REPO=username/repository
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id
```

### 6. Run Development Server

```bash
npm run dev
```

Visit:
- **Main site:** http://localhost:3000
- **Sanity Studio:** http://localhost:3000/studio

### 7. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Don't forget to add your production URL to Sanity CORS settings.

## Usage

### Submitting Content

1. Users visit `/submit`
2. Fill out the form with:
   - Title
   - Description
   - Screenshot (required)
   - Time wasted
   - Category
   - Severity level
   - Name (optional)
3. Submissions are created with `approved: false`

### Moderating Submissions

1. Go to `/studio` (or your production domain + `/studio`)
2. Login with your Sanity credentials
3. Review submissions (they'll show ⏳ if pending, ✅ if approved)
4. Edit the submission and toggle the "Approved" checkbox
5. Publish changes
6. The submission now appears on the homepage

### Managing Content

The Sanity Studio at `/studio` provides:
- Full CRUD operations on submissions
- Image management
- Manual upvote adjustment (if needed)
- Filtering and search

## Schema

Each submission includes:

```typescript
{
  title: string
  slug: string
  description: string
  screenshot: image
  timeWasted: number (minutes)
  category: 'software' | 'website' | 'hardware' | 'os' | 'iot' | 'payment' | 'transportation' | 'other'
  severity: 'mild' | 'moderate' | 'severe'
  submittedBy: string (optional)
  upvotes: number
  approved: boolean
  publishedAt: datetime
}
```

## Customization

### Styling

The site uses a bold, brutalist design with:
- Yellow (`bg-yellow-400`) background
- Black borders and text
- High contrast elements
- Tailwind CSS for all styling

Edit components in `/components` or pages in `/app` to customize.

### Categories

Add/remove categories in:
- `/sanity/schema.ts` (Sanity schema)
- Component files that use category labels

### Severity Levels

Modify in `/sanity/schema.ts` to change emoji and labels.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Troubleshooting

**Images not loading?**
- Check Sanity CORS settings
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct

**Submissions failing?**
- Ensure `SANITY_API_TOKEN` has Editor permissions
- Check Sanity API token hasn't expired

**Comments not showing?**
- Verify all Giscus env vars are set
- Ensure GitHub Discussions is enabled on your repo

## License

MIT - Do whatever you want with this.

## Contributing

Found a bug? (How ironic.) Open an issue or PR!
