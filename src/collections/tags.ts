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
