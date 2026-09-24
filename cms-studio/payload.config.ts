import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { Forms } from '@/collections/Forms'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function requiredEnvironment(name: 'DATABASE_URL' | 'PAYLOAD_SECRET'): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is required for CMS Studio`)
  }
  return value
}

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Pages, Forms, Media],
  db: postgresAdapter({
    pool: {
      connectionString: requiredEnvironment('DATABASE_URL'),
    },
  }),
  editor: lexicalEditor(),
  secret: requiredEnvironment('PAYLOAD_SECRET'),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL?.trim() || undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
