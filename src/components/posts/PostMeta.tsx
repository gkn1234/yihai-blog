// src/components/posts/PostMeta.tsx
import { Calendar, Clock, User } from 'lucide-react'
import type { Post, User as UserType } from '@/payload-types'

interface PostMetaProps {
  post: Post
  showAuthor?: boolean
}

export function PostMeta({ post, showAuthor = true }: PostMetaProps) {
  const author = post.author as UserType | null
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {showAuthor && author && (
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {author.email?.split('@')[0]}
        </span>
      )}
      {publishedAt && (
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {publishedAt}
        </span>
      )}
      {post.readingTime && (
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {post.readingTime} 分钟阅读
        </span>
      )}
    </div>
  )
}
