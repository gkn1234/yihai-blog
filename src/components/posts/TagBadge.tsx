// src/components/posts/TagBadge.tsx
import Link from 'next/link'
import type { Tag } from '@/payload-types'

interface TagBadgeProps {
  tag: Tag
  linked?: boolean
}

export function TagBadge({ tag, linked = true }: TagBadgeProps) {
  const badge = (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color || '#10b981',
      }}
    >
      {tag.name}
    </span>
  )

  if (linked) {
    return (
      <Link href={`/tags/${tag.slug}`} className="hover:opacity-80">
        {badge}
      </Link>
    )
  }

  return badge
}
