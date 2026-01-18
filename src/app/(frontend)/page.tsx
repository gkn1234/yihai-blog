// src/app/(frontend)/page.tsx
import { Container } from '@/components/layout'
import { PostList } from '@/components/posts'
import { getPosts } from '@/lib/payload'

export default async function HomePage() {
  const { docs: posts } = await getPosts({ limit: 12 })

  return (
    <Container className="py-12">
      <section className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-foreground">
          云深亦知梦
        </h1>
        <p className="text-lg text-muted-foreground">
          记录技术探索与生活感悟
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          最新文章
        </h2>
        <PostList posts={posts} />
      </section>
    </Container>
  )
}
