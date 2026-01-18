# 博客 "云深亦知梦" 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 Payload CMS 项目创建一个清新自然风格的博客前端，包含文章发布、标签管理、首页列表和详情页功能。

**Architecture:** 基于现有的 Payload CMS 3.72 + Next.js 15 架构，添加 Posts 和 Tags 两个 Collection 实现内容管理，前端使用 Tailwind CSS + shadcn/ui 组件构建清新自然风格的界面。

**Tech Stack:** Payload CMS 3.72, Next.js 15, React 19, Tailwind CSS 4, MongoDB, Lexical Editor, shadcn/ui

---

## Phase 1: 数据模型层

### Task 1: 创建 Tags Collection

**Files:**
- Create: `src/collections/tags.ts`

**Step 1: 创建标签集合配置**

```typescript
// src/collections/tags.ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
    group: '内容管理',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '标签名称',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL 标识',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: '用于 URL 的唯一标识符',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
    },
    {
      name: 'color',
      type: 'text',
      label: '标签颜色',
      defaultValue: '#10b981',
      admin: {
        description: 'CSS 颜色值，如 "#10b981"',
      },
    },
  ],
}
```

**Step 2: 验证文件创建成功**

Run: `ls src/collections/tags.ts`
Expected: 文件存在

---

### Task 2: 创建 Posts Collection

**Files:**
- Create: `src/collections/posts.ts`

**Step 1: 创建文章集合配置**

```typescript
// src/collections/posts.ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', '_status', 'publishedAt', 'updatedAt'],
    group: '内容管理',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 30000 },
    },
    maxPerDoc: 10,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '文章标题',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL 标识',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: '文章的 URL 路径',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: '摘要',
      maxLength: 300,
      admin: {
        description: '文章简短描述，用于列表展示',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: '封面图片',
      relationTo: 'media',
      admin: {
        description: '推荐尺寸: 1200x630px',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: '文章内容',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      label: '标签',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      label: '作者',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: '发布时间',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: '阅读时长(分钟)',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.content) {
              const text = JSON.stringify(data.content)
              const charCount = text.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '').length
              return Math.max(1, Math.ceil(charCount / 400))
            }
            return 1
          },
        ],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '精选文章',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
```

---

### Task 3: 注册 Collections 到配置

**Files:**
- Modify: `src/collections/index.ts`
- Modify: `src/payload.config.ts`

**Step 1: 更新 collections 导出**

在 `src/collections/index.ts` 添加导出:

```typescript
export { Media } from './media'
export { Users } from './users'
export { Posts } from './posts'
export { Tags } from './tags'
```

**Step 2: 更新 payload.config.ts**

修改 `src/payload.config.ts`:

```typescript
import {
  Media,
  Posts,
  Tags,
  Users,
} from './collections'

// 在 buildConfig 中更新 collections:
collections: [Users, Media, Posts, Tags],
```

**Step 3: 生成类型**

Run: `pnpm generate:types`
Expected: 成功生成 `src/payload-types.ts`

**Step 4: 验证 TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

**Step 5: Commit**

```bash
git add src/collections/tags.ts src/collections/posts.ts src/collections/index.ts src/payload.config.ts src/payload-types.ts
git commit -m "feat: add Posts and Tags collections with drafts support"
```

---

## Phase 2: 前端基础组件

### Task 4: 更新全局样式配色 - 翠绿 Emerald 主题

**Files:**
- Modify: `src/app/(frontend)/global.css`

**设计说明:**
- 主色调: 翠绿 Emerald (H≈162)
- 背景: 纯白
- 圆角: 中等 (0.625rem - shadcn 默认)
- 所有中性色带微弱绿色调，整体更协调

**Step 1: 替换 `:root` 中的 CSS 变量**

将 `:root { ... }` 替换为:

```css
:root {
  /* 主色调 - 翠绿 Emerald */
  --primary: oklch(0.696 0.17 162);
  --primary-foreground: oklch(0.985 0 0);

  /* 背景 - 纯白 */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0.014 162);

  /* 卡片 */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0.014 162);

  /* 弹出层 */
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0.014 162);

  /* 次要色 - 带绿调的浅灰 */
  --secondary: oklch(0.967 0.01 162);
  --secondary-foreground: oklch(0.205 0.02 162);

  /* 静音色 */
  --muted: oklch(0.967 0.01 162);
  --muted-foreground: oklch(0.556 0.02 162);

  /* 强调色 */
  --accent: oklch(0.967 0.01 162);
  --accent-foreground: oklch(0.205 0.02 162);

  /* 危险色保持红色 */
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);

  /* 边框和输入 */
  --border: oklch(0.922 0.01 162);
  --input: oklch(0.922 0.01 162);
  --ring: oklch(0.765 0.16 162);

  /* 图表颜色 - 清新自然系列 */
  --chart-1: oklch(0.696 0.17 162);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.65 0.15 220);
  --chart-4: oklch(0.75 0.15 140);
  --chart-5: oklch(0.7 0.12 200);

  --radius: 0.625rem;

  /* Sidebar */
  --sidebar: oklch(0.985 0.005 162);
  --sidebar-foreground: oklch(0.145 0.014 162);
  --sidebar-primary: oklch(0.696 0.17 162);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.01 162);
  --sidebar-accent-foreground: oklch(0.205 0.02 162);
  --sidebar-border: oklch(0.922 0.01 162);
  --sidebar-ring: oklch(0.765 0.16 162);
}
```

**Step 2: 替换 `.dark` 中的 CSS 变量**

将 `.dark { ... }` 替换为:

```css
.dark {
  /* 主色调 - 亮翠绿 */
  --primary: oklch(0.765 0.16 162);
  --primary-foreground: oklch(0.145 0.014 162);

  /* 背景 - 带绿调的深色 */
  --background: oklch(0.145 0.014 162);
  --foreground: oklch(0.985 0 0);

  /* 卡片 */
  --card: oklch(0.205 0.02 162);
  --card-foreground: oklch(0.985 0 0);

  /* 弹出层 */
  --popover: oklch(0.205 0.02 162);
  --popover-foreground: oklch(0.985 0 0);

  /* 次要色 */
  --secondary: oklch(0.269 0.02 162);
  --secondary-foreground: oklch(0.985 0 0);

  /* 静音色 */
  --muted: oklch(0.269 0.02 162);
  --muted-foreground: oklch(0.708 0.02 162);

  /* 强调色 */
  --accent: oklch(0.269 0.02 162);
  --accent-foreground: oklch(0.985 0 0);

  /* 危险色 */
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.637 0.237 25.331);

  /* 边框和输入 */
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.696 0.17 162);

  /* 图表颜色 */
  --chart-1: oklch(0.765 0.16 162);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  /* Sidebar */
  --sidebar: oklch(0.205 0.02 162);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.765 0.16 162);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0.02 162);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.696 0.17 162);
}
```

**配色说明:**
| 变量 | Light Mode | Dark Mode | 用途 |
|------|------------|-----------|------|
| `--primary` | `oklch(0.696 0.17 162)` | `oklch(0.765 0.16 162)` | 按钮、链接、高亮 |
| `--ring` | `oklch(0.765 0.16 162)` | `oklch(0.696 0.17 162)` | 聚焦环 |
| `--foreground` | `oklch(0.145 0.014 162)` | `oklch(0.985 0 0)` | 正文文字(带绿调) |
| `--muted` | `oklch(0.967 0.01 162)` | `oklch(0.269 0.02 162)` | 次要背景 |
| `--border` | `oklch(0.922 0.01 162)` | `oklch(1 0 0 / 10%)` | 边框 |

---

### Task 5: 创建布局组件 - Header

**Files:**
- Create: `src/components/layout/Header.tsx`

**Step 1: 创建 Header 组件**

```tsx
// src/components/layout/Header.tsx
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          云深亦知梦
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            首页
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            关于
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

---

### Task 6: 创建布局组件 - Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

**Step 1: 创建 Footer 组件**

```tsx
// src/components/layout/Footer.tsx
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 py-8">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
        <p>© {currentYear} 云深亦知梦. All rights reserved.</p>
      </div>
    </footer>
  )
}
```

---

### Task 7: 创建布局组件 - Container

**Files:**
- Create: `src/components/layout/Container.tsx`
- Create: `src/components/layout/index.ts`

**Step 1: 创建 Container 组件**

```tsx
// src/components/layout/Container.tsx
import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-4xl px-4 ${className}`}>
      {children}
    </div>
  )
}
```

**Step 2: 创建 index.ts 导出**

```typescript
// src/components/layout/index.ts
export { Header } from './Header'
export { Footer } from './Footer'
export { Container } from './Container'
```

---

### Task 8: 更新前端 Layout

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`

**Step 1: 集成 Header 和 Footer**

```tsx
// src/app/(frontend)/layout.tsx
import type { ReactNode } from 'react'
import { Header, Footer } from '@/components/layout'
import './global.css'

export const metadata = {
  title: '云深亦知梦',
  description: '记录技术探索与生活感悟',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

**Step 2: Commit 布局组件**

```bash
git add src/components/layout/ src/app/\(frontend\)/layout.tsx src/app/\(frontend\)/global.css
git commit -m "feat: add Header, Footer, Container layout components with fresh theme"
```

---

## Phase 3: 文章相关组件

### Task 9: 创建 Payload 查询工具

**Files:**
- Create: `src/lib/payload.ts`

**Step 1: 创建查询封装函数**

```typescript
// src/lib/payload.ts
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

  const where: Record<string, unknown> = {
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
```

---

### Task 10: 创建 TagBadge 组件

**Files:**
- Create: `src/components/posts/TagBadge.tsx`

**Step 1: 创建标签徽章组件**

```tsx
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
```

---

### Task 11: 创建 PostMeta 组件

**Files:**
- Create: `src/components/posts/PostMeta.tsx`

**Step 1: 创建文章元信息组件**

```tsx
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
```

---

### Task 12: 创建 PostCard 组件

**Files:**
- Create: `src/components/posts/PostCard.tsx`

**Step 1: 创建文章卡片组件**

```tsx
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
```

---

### Task 13: 创建 PostList 组件

**Files:**
- Create: `src/components/posts/PostList.tsx`
- Create: `src/components/posts/index.ts`

**Step 1: 创建文章列表组件**

```tsx
// src/components/posts/PostList.tsx
import type { Post } from '@/payload-types'
import { PostCard } from './PostCard'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        暂无文章
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

**Step 2: 创建 index.ts 导出**

```typescript
// src/components/posts/index.ts
export { PostCard } from './PostCard'
export { PostList } from './PostList'
export { PostMeta } from './PostMeta'
export { TagBadge } from './TagBadge'
```

**Step 3: Commit 文章组件**

```bash
git add src/lib/payload.ts src/components/posts/
git commit -m "feat: add PostCard, PostList, PostMeta, TagBadge components"
```

---

## Phase 4: 页面实现

### Task 14: 重写首页

**Files:**
- Modify: `src/app/(frontend)/page.tsx`

**Step 1: 实现首页文章列表**

```tsx
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
```

---

### Task 15: 创建文章详情页

**Files:**
- Create: `src/app/(frontend)/posts/[slug]/page.tsx`

**Step 1: 创建详情页目录和文件**

```tsx
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
```

---

### Task 16: 创建关于页面

**Files:**
- Create: `src/app/(frontend)/about/page.tsx`

**Step 1: 创建关于页面**

```tsx
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
```

**Step 2: Commit 页面实现**

```bash
git add src/app/\(frontend\)/page.tsx src/app/\(frontend\)/posts/ src/app/\(frontend\)/about/
git commit -m "feat: add homepage, post detail page, and about page"
```

---

## Phase 5: 验证与测试

### Task 17: 启动开发服务器验证

**Step 1: 启动开发服务器**

Run: `pnpm dev`
Expected: 服务器启动成功，无报错

**Step 2: 访问 Admin Panel 创建测试数据**

1. 访问 http://localhost:3000/admin
2. 创建 3-5 个标签
3. 创建 2-3 篇文章（包含标签、封面图、内容）
4. 发布文章

**Step 3: 验证前端页面**

1. 访问首页 http://localhost:3000 - 检查文章列表显示
2. 点击文章卡片 - 检查详情页显示
3. 访问关于页面 http://localhost:3000/about - 检查页面显示

**Step 4: 运行类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无 TypeScript 错误

**Step 5: Final Commit**

```bash
git add -A
git commit -m "feat: complete blog 'Yunshen' with posts, tags, and fresh theme"
```

---

## Verification Checklist

- [ ] Tags Collection 可在 Admin Panel 管理
- [ ] Posts Collection 支持草稿和发布状态
- [ ] 首页正确显示已发布文章列表
- [ ] 文章详情页正确渲染富文本内容
- [ ] 关于页面正常显示
- [ ] Header 导航正常工作
- [ ] 清新自然配色主题生效
- [ ] TypeScript 类型检查通过
- [ ] 响应式布局在移动端正常显示
