// src/lib/payload.ts
import type { Where } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getPayloadClient() {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

export async function getPosts(options?: {
  limit?: number
  page?: number
  tag?: string
  featured?: boolean
}) {
  const payload = await getPayloadClient()

  const where: Where = {
    _status: { equals: 'published' },
  }

  if (options?.tag) {
    where['tags.slug'] = { equals: options.tag }
  }

  if (options?.featured) {
    where.featured = { equals: true }
  }

  return payload.find({
    collection: 'posts',
    where,
    limit: options?.limit || 10,
    page: options?.page || 1,
    sort: '-publishedAt',
    depth: 2,
  })
}

export async function getPostBySlug(slug: string) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })

  return result.docs[0] || null
}

export async function getAllTags() {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'tags',
    limit: 100,
    sort: 'name',
  })
}
