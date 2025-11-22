'use client'

import Link from 'next/link'
import { tagLabels } from '@/lib/categories'

interface TagCloudProps {
  data: Record<string, number>
  title?: string
  linkBase?: string
}

export default function TagCloud({ data, title = 'Top Issues', linkBase }: TagCloudProps) {
  const sortedTags = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)

  const maxCount = Math.max(...sortedTags.map(([, count]) => count))
  const minCount = Math.min(...sortedTags.map(([, count]) => count))

  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 'text-lg'
    const normalized = (count - minCount) / (maxCount - minCount)
    if (normalized > 0.8) return 'text-3xl'
    if (normalized > 0.6) return 'text-2xl'
    if (normalized > 0.4) return 'text-xl'
    if (normalized > 0.2) return 'text-lg'
    return 'text-base'
  }

  const getColor = (count: number) => {
    if (maxCount === minCount) return 'text-red-600'
    const normalized = (count - minCount) / (maxCount - minCount)
    if (normalized > 0.8) return 'text-red-700'
    if (normalized > 0.6) return 'text-red-600'
    if (normalized > 0.4) return 'text-orange-600'
    if (normalized > 0.2) return 'text-yellow-700'
    return 'text-gray-700'
  }

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h3 className="text-2xl font-black uppercase mb-6">{title}</h3>

      <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
        {sortedTags.map(([tag, count]) => {
          const fontSize = getFontSize(count)
          const color = getColor(count)
          const content = (
            <div className={`${fontSize} ${color} font-black hover:scale-110 transition-transform cursor-pointer text-center`}>
              <div>{tagLabels[tag] || tag}</div>
              <div className="text-xs text-gray-600 font-bold">({count})</div>
            </div>
          )

          return linkBase ? (
            <Link key={tag} href={`${linkBase}?tag=${tag}`}>
              {content}
            </Link>
          ) : (
            <div key={tag}>{content}</div>
          )
        })}
      </div>
    </div>
  )
}
