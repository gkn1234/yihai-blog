import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { 
  Users, Media } from './collections'

  const filename = fileURLToPath(import.meta.url)
const dir = dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: resolve(dir),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: resolve(dir, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: env.DATABASE_URI ?? '',
  }),
  sharp,
  plugins: [],
})
