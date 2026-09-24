import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { Forms } from '@/collections/Forms'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { SiteFooter } from '@/globals/SiteFooter'
import { SiteNavigation } from '@/globals/SiteNavigation'
import { syncPublishedFormVersion } from '@/jobs/sync-published-form-version'

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
  globals: [SiteNavigation, SiteFooter],
  db: postgresAdapter({
    pool: {
      connectionString: requiredEnvironment('DATABASE_URL'),
    },
  }),
  editor: lexicalEditor(),
  jobs: {
    tasks: [
      {
        slug: 'syncPublishedFormVersion',
        retries: 5,
        inputSchema: [
          { name: 'formId', type: 'text', required: true },
          { name: 'sourceRevision', type: 'text', required: true },
          { name: 'schema', type: 'json', required: true },
        ],
        outputSchema: [
          { name: 'formVersionId', type: 'text', required: true },
          { name: 'runtimeVersion', type: 'number', required: true },
          { name: 'replayed', type: 'checkbox', required: true },
          { name: 'publishedAt', type: 'date', required: true },
        ],
        handler: async ({ input }) => ({
          output: await syncPublishedFormVersion({
            formId: input.formId,
            sourceRevision: input.sourceRevision,
            schema: input.schema as Parameters<typeof syncPublishedFormVersion>[0]['schema'],
          }),
        }),
      },
    ],
  },
  secret: requiredEnvironment('PAYLOAD_SECRET'),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL?.trim() || undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
