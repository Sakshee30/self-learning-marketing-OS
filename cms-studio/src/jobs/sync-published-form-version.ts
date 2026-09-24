import { publishFormVersionToWebsiteApi } from '@/integrations/website-api/publish-form-version'
import type { PublishedFormPublication, RuntimeFormSchema } from '@/publishing/form-runtime-contract'

interface SyncPublishedFormInput {
  formId: string
  sourceRevision: string
  schema: RuntimeFormSchema
}

export async function syncPublishedFormVersion(input: SyncPublishedFormInput) {
  const receipt = await publishFormVersionToWebsiteApi(input as PublishedFormPublication)
  return {
    formVersionId: receipt.formVersionId,
    runtimeVersion: receipt.version,
    replayed: receipt.replayed,
    publishedAt: receipt.publishedAt,
  }
}
