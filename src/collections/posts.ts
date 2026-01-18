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
