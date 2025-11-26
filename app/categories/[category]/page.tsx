import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { client, Submission } from '@/lib/sanity'
import { categoryHierarchy, getPrimaryCategoryLabel, getSubcategoryLabel, tagLabels } from '@/lib/categories'
import SubmissionCard from '@/components/SubmissionCard'
import Header from '@/components/Header'

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ subcategory?: string; tag?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const categoryInfo = categoryHierarchy.find(c => c.value === category)

  if (!categoryInfo) {
    return {
      title: 'Category Not Found | Nothing Fucking Works',
    }
  }

  return {
    title: `${categoryInfo.label} | Nothing Fucking Works`,
    description: `Browse broken ${categoryInfo.label.toLowerCase()} technology and share your frustrations.`,
  }
}

async function getSubmissionsByCategory(category: string): Promise<Submission[]> {
  const query = `
    *[_type == "submission" && approved == true && hiddenByModeration != true && primaryCategory == $category] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      company,
      description,
      screenshot,
      primaryCategory,
      subcategory,
      tags,
      severity,
      submittedBy,
      upvotes,
      downvotes,
      meToos,
      approved,
      publishedAt
    }
  `
  return client.fetch(query, { category })
}

async function getCategoryStats(category: string) {
  const submissions = await getSubmissionsByCategory(category)

  let totalTimeWasted = 0
  let totalReports = 0
  const subcategoryCount: Record<string, number> = {}
  const tagCount: Record<string, number> = {}
  const severityCount = { trivial: 0, mild: 0, moderate: 0, serious: 0, severe: 0, critical: 0 }

  submissions.forEach(s => {
    // Count subcategories
    subcategoryCount[s.subcategory] = (subcategoryCount[s.subcategory] || 0) + 1

    // Count tags
    if (s.tags) {
      s.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }

    // Count severity
    severityCount[s.severity as keyof typeof severityCount]++

    // Total reports and time
    if (s.meToos) {
      s.meToos.forEach(m => {
        totalTimeWasted += m.timeWasted || 0
        totalReports++
      })
    }
  })

  const severityValues: Record<string, number> = {
    trivial: 1,
    mild: 2,
    moderate: 3,
    serious: 4,
    severe: 5,
    critical: 6,
  }

  const avgSeverity = submissions.length > 0
    ? submissions.reduce((sum, s) => sum + (severityValues[s.severity] || 1), 0) / submissions.length
    : 0

  return {
    totalSubmissions: submissions.length,
    totalReports,
    totalTimeWasted,
    avgSeverity,
    subcategoryCount,
    tagCount,
    severityCount,
  }
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const { category } = await params
  const { subcategory: selectedSubcategory, tag: selectedTag } = await searchParams

  const categoryInfo = categoryHierarchy.find(c => c.value === category)

  if (!categoryInfo) {
    notFound()
  }

  const allSubmissions = await getSubmissionsByCategory(category)
  const stats = await getCategoryStats(category)

  // Apply filters
  let submissions = allSubmissions
  if (selectedSubcategory) {
    submissions = submissions.filter(s => s.subcategory === selectedSubcategory)
  }
  if (selectedTag) {
    submissions = submissions.filter(s => s.tags?.includes(selectedTag))
  }

  if (allSubmissions.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-yellow-400">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Compact Header with Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 mb-4">
          {/* Left: Category Info + Stats */}
          <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{categoryInfo.emoji}</span>
              <h2 className="text-2xl md:text-3xl font-black uppercase text-red-600">
                {categoryInfo.label}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black text-white px-3 py-2 border-2 border-black font-black text-center">
                <div className="text-xl">{stats.totalSubmissions}</div>
                <div className="text-[9px] uppercase">Broken</div>
              </div>
              <div className="bg-red-500 text-white px-3 py-2 border-2 border-black font-black text-center">
                <div className="text-xl">{stats.totalReports.toLocaleString()}</div>
                <div className="text-[9px] uppercase">Reports</div>
              </div>
              <div className="bg-orange-500 text-white px-3 py-2 border-2 border-black font-black text-center">
                <div className="text-xl">{stats.totalTimeWasted.toLocaleString()}</div>
                <div className="text-[9px] uppercase">Min</div>
              </div>
              <div className={`px-3 py-2 border-2 border-black font-black text-center ${
                stats.avgSeverity >= 2.5 ? 'bg-red-600 text-white' :
                stats.avgSeverity >= 1.5 ? 'bg-orange-500 text-white' :
                'bg-yellow-400 text-black'
              }`}>
                <div className="text-xl">
                  {stats.avgSeverity >= 2.5 ? '💀' :
                   stats.avgSeverity >= 1.5 ? '🤬' :
                   '😠'}
                </div>
                <div className="text-[9px] uppercase">Avg</div>
              </div>
            </div>

            {/* Severity Distribution */}
            <div className="mt-3 bg-gray-100 p-2 border-2 border-gray-300">
              <div className="text-[9px] font-black uppercase mb-1.5">Rage Distribution</div>
              <div className="flex items-center gap-1 h-5">
                <div
                  className="bg-yellow-500 border-2 border-black flex items-center justify-center text-[10px] font-bold"
                  style={{ flex: stats.severityCount.mild || 1 }}
                >
                  {stats.severityCount.mild > 0 && `${stats.severityCount.mild}`}
                </div>
                <div
                  className="bg-orange-500 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ flex: stats.severityCount.moderate || 1 }}
                >
                  {stats.severityCount.moderate > 0 && `${stats.severityCount.moderate}`}
                </div>
                <div
                  className="bg-red-600 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ flex: stats.severityCount.severe || 1 }}
                >
                  {stats.severityCount.severe > 0 && `${stats.severityCount.severe}`}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Top Tags (full width on desktop) */}
          {Object.keys(stats.tagCount).length > 0 && (
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
              <div className="text-xs font-black uppercase mb-2">Top Issues</div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(stats.tagCount)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 20)
                  .map(([tag, count]) => (
                    <Link
                      key={tag}
                      href={`/categories/${category}?tag=${tag}`}
                      className={`px-2 py-1 text-[10px] font-bold border-2 border-black transition-colors ${
                        selectedTag === tag ? 'bg-red-500 text-white' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {tagLabels[tag]?.replace(/^[^\s]+ /, '') || tag} ({count})
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Subcategory Filter & Status Combined */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
          <div className="p-2.5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="text-[10px] font-black uppercase text-gray-600">Filter by subcategory:</div>
              {(selectedSubcategory || selectedTag) && (
                <Link
                  href={`/categories/${category}`}
                  className="text-[10px] font-bold text-red-600 hover:underline uppercase shrink-0"
                >
                  Clear ({submissions.length})
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={`/categories/${category}`}
                className={`px-2 py-1 text-[10px] font-bold uppercase border-2 border-black hover:bg-yellow-400 transition-colors ${
                  !selectedSubcategory && !selectedTag ? 'bg-yellow-400' : 'bg-white'
                }`}
              >
                All ({allSubmissions.length})
              </Link>
              {Object.entries(stats.subcategoryCount)
                .sort(([, a], [, b]) => b - a)
                .map(([subcategory, count]) => (
                  <Link
                    key={subcategory}
                    href={`/categories/${category}?subcategory=${subcategory}`}
                    className={`px-2 py-1 text-[10px] font-bold uppercase border-2 border-black hover:bg-yellow-400 transition-colors ${
                      selectedSubcategory === subcategory ? 'bg-yellow-400' : 'bg-white'
                    }`}
                  >
                    {getSubcategoryLabel(category, subcategory)} ({count})
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white border-4 border-black p-8 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-3">NO MATCHES</h3>
              <p className="text-base mb-4">No submissions match your current filters.</p>
              <Link
                href={`/categories/${category}`}
                className="inline-block bg-black text-white font-black uppercase py-2 px-4 text-sm border-4 border-black hover:bg-gray-800"
              >
                Clear Filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {submissions.map((submission) => (
              <SubmissionCard key={submission._id} submission={submission} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-8 border-black bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-bold">
            Built with frustration. Powered by collective rage.
          </p>
        </div>
      </footer>
    </div>
  )
}
