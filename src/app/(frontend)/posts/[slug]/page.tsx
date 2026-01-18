// src/app/(frontend)/posts/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Container } from '@/components/layout'
import { PostMeta, TagBadge } from '@/components/posts'
import { getPostBySlug } from '@/lib/payload'
import type { Media, Tag } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: '文章未找到 - 云深亦知梦' }
  }

  return {
    title: `${post.title} - 云深亦知梦`,
    description: post.excerpt || undefined,
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const coverImage = post.coverImage as Media | null
  const tags = (post.tags || []) as Tag[]

  return (
    <article>
      {coverImage?.url && (
        <div className="relative h-64 w-full sm:h-80 md:h-96">
          <Image
            src={coverImage.url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <Container className="py-8">
        <header className="mb-8">
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <PostMeta post={post} />
        </header>

        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary">
          {post.content && <RichText data={post.content} />}
        </div>
      </Container>
    </article>
  )
}
