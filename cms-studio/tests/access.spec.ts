import { describe, expect, it } from 'vitest'
import { canPublishUser, userHasAnyRole } from '@/access/roles'

describe('CMS Studio role policy', () => {
  it('allows only publishing roles to publish', () => {
    expect(canPublishUser({ role: 'website-admin' })).toBe(true)
    expect(canPublishUser({ role: 'marketing-manager' })).toBe(true)
    expect(canPublishUser({ role: 'reviewer-publisher' })).toBe(true)
    expect(canPublishUser({ role: 'editor' })).toBe(false)
    expect(canPublishUser({ role: 'seo-manager' })).toBe(false)
  })

  it('does not infer privileged access from unrelated user properties', () => {
    expect(userHasAnyRole({ role: 'editor', isAdmin: true }, ['website-admin'])).toBe(false)
    expect(userHasAnyRole({ role: 'website-admin' }, ['website-admin'])).toBe(true)
  })
})
