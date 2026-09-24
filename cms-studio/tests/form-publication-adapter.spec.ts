import { describe, expect, it, vi } from 'vitest'
import { publishFormVersionToWebsiteApi } from '../src/integrations/website-api/publish-form-version'

describe('Website API form publication adapter', () => {
  it('sends the approved revision through the authenticated internal contract', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          formId: 'request-access',
          formVersionId: 'runtime-version-1',
          version: 1,
          sourceRevision: 'a'.repeat(64),
          publishedAt: '2026-09-24T00:00:00.000Z',
          replayed: false,
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    ) as unknown as typeof fetch

    const receipt = await publishFormVersionToWebsiteApi(
      {
        formId: 'request-access',
        sourceRevision: 'a'.repeat(64),
        schema: {
          fields: [{ name: 'email', label: 'Email', type: 'email', required: true }],
        },
      },
      {
        baseUrl: 'http://website-api.test',
        syncToken: 'a-secure-server-to-server-token',
        timeoutMs: 5_000,
      },
      fetchImpl,
    )

    expect(receipt.version).toBe(1)
    expect(fetchImpl).toHaveBeenCalledOnce()
    const [url, options] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('http://website-api.test/v1/internal/forms/request-access/published-version')
    expect(options.method).toBe('PUT')
    expect((options.headers as Record<string, string>).authorization).toBe(
      'Bearer a-secure-server-to-server-token',
    )
  })

  it('does not treat a rejected synchronization as success', async () => {
    const fetchImpl = vi.fn(async () => new Response('', { status: 503 })) as unknown as typeof fetch

    await expect(
      publishFormVersionToWebsiteApi(
        {
          formId: 'request-access',
          sourceRevision: 'b'.repeat(64),
          schema: {
            fields: [{ name: 'email', label: 'Email', type: 'email', required: true }],
          },
        },
        {
          baseUrl: 'http://website-api.test',
          syncToken: 'a-secure-server-to-server-token',
          timeoutMs: 5_000,
        },
        fetchImpl,
      ),
    ).rejects.toThrow('HTTP 503')
  })
})
