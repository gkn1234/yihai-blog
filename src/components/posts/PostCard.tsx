// src/components/posts/PostCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Media, Post, Tag } from '@/payload-types'
import { PostMeta } from './PostMeta'
import { TagBadge } from './TagBadge'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const coverImage = post.coverImage as Media | null
  const tags = (post.tags || []) as Tag[]

  return (
    <article className="group overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      {coverImage?.url && (
        <Link href={`/posts/${post.slug}`} className="block aspect-video overflow-hidden">
          <Image
            src={coverImage.url}
            alt={post.title}
            width={600}
            height={340}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </Link>
      )}
      <div className="p-5">
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
        <Link href={`/posts/${post.slug}`}>
          <h2 className="mb-2 text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <PostMeta post={post} showAuthor={false} />
      </div>
    </article>
  )
}
