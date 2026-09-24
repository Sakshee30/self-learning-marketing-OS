import type { PublishedFormPublication } from '@/publishing/form-runtime-contract'

export interface WebsiteApiFormPublicationReceipt {
  formId: string
  formVersionId: string
  version: number
  sourceRevision: string
  publishedAt: string
  replayed: boolean
}

export interface WebsiteApiPublicationConfig {
  baseUrl: string
  syncToken: string
  timeoutMs: number
}

export function loadWebsiteApiPublicationConfig(
  env: NodeJS.ProcessEnv = process.env,
): WebsiteApiPublicationConfig {
  const rawBaseUrl = env.WEBSITE_API_INTERNAL_URL?.trim()
  if (!rawBaseUrl) throw new Error('WEBSITE_API_INTERNAL_URL is required for form publication jobs')

  const url = new URL(rawBaseUrl)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('WEBSITE_API_INTERNAL_URL must use http or https')
  }

  const syncToken = env.WEBSITE_API_SYNC_TOKEN?.trim()
  if (!syncToken || syncToken.length < 24) {
    throw new Error('WEBSITE_API_SYNC_TOKEN must be configured with at least 24 characters')
  }

  const rawTimeout = env.WEBSITE_API_SYNC_TIMEOUT_MS?.trim()
  const timeoutMs = rawTimeout ? Number(rawTimeout) : 10_000
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 60_000) {
    throw new Error('WEBSITE_API_SYNC_TIMEOUT_MS must be an integer between 1000 and 60000')
  }

  url.pathname = url.pathname.replace(/\/+$/, '')
  url.search = ''
  url.hash = ''

  return {
    baseUrl: url.toString().replace(/\/$/, ''),
    syncToken,
    timeoutMs,
  }
}

function isReceipt(value: unknown): value is WebsiteApiFormPublicationReceipt {
  if (!value || typeof value !== 'object') return false
  const receipt = value as Record<string, unknown>
  return (
    typeof receipt.formId === 'string' &&
    typeof receipt.formVersionId === 'string' &&
    typeof receipt.version === 'number' &&
    Number.isInteger(receipt.version) &&
    typeof receipt.sourceRevision === 'string' &&
    typeof receipt.publishedAt === 'string' &&
    typeof receipt.replayed === 'boolean'
  )
}

export async function publishFormVersionToWebsiteApi(
  publication: PublishedFormPublication,
  config: WebsiteApiPublicationConfig = loadWebsiteApiPublicationConfig(),
  fetchImpl: typeof fetch = fetch,
): Promise<WebsiteApiFormPublicationReceipt> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs)
  const endpoint = `${config.baseUrl}/v1/internal/forms/${encodeURIComponent(publication.formId)}/published-version`

  try {
    const response = await fetchImpl(endpoint, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${config.syncToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sourceRevision: publication.sourceRevision,
        schema: publication.schema,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Website API rejected form publication with HTTP ${response.status}`)
    }

    const receipt: unknown = await response.json()
    if (!isReceipt(receipt)) {
      throw new Error('Website API returned an invalid form publication receipt')
    }
    if (
      receipt.formId !== publication.formId ||
      receipt.sourceRevision.toLowerCase() !== publication.sourceRevision.toLowerCase()
    ) {
      throw new Error('Website API form publication receipt does not match the requested revision')
    }

    return receipt
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Website API form publication timed out', { cause: error })
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
