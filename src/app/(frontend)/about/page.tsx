// src/app/(frontend)/about/page.tsx
import type { Metadata } from 'next'
import { Container } from '@/components/layout'

export const metadata: Metadata = {
  title: '关于 - 云深亦知梦',
  description: '关于这个博客和作者',
}

export default function AboutPage() {
  return (
    <Container className="py-12">
      <article className="prose prose-lg mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">关于</h1>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">关于博客</h2>
          <p className="text-muted-foreground">
            「云深亦知梦」是一个记录技术探索与生活感悟的个人博客。
            在这里，我会分享编程技术、开发心得，以及对生活的思考。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">关于作者</h2>
          <p className="text-muted-foreground">
            一名热爱技术的开发者，专注于前端开发和全栈技术。
            喜欢探索新技术，也享受解决问题的过程。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">联系方式</h2>
          <p className="text-muted-foreground">
            如有问题或建议，欢迎通过邮件联系我。
          </p>
        </section>
      </article>
    </Container>
  )
}
