import { describe, expect, it } from 'vitest'
import { createPublicSiteSnapshot } from '../src/publishing/public-site-snapshot'

describe('public site snapshot', () => {
  it('normalizes published navigation and footer content', () => {
    expect(
      createPublicSiteSnapshot({
        navigation: {
          brand: {
            name: 'GrowthOS',
            descriptor: 'Self-Learning Marketing OS',
            description: 'A governed marketing operating system.',
          },
          primaryNavigation: [
            { id: 'payload-row', label: 'Product', href: '/product', trackingId: 'nav-product' },
          ],
          primaryCta: { label: 'Request access', href: '/contact' },
        },
        footer: {
          groups: [
            {
              id: 'group-row',
              title: 'Product',
              links: [{ id: 'link-row', label: 'Capabilities', href: '/product' }],
            },
          ],
          copyrightText: 'GrowthOS. Product capabilities follow the published contract.',
          governanceText: 'Human approval remains part of consequential execution.',
        },
      }),
    ).toEqual({
      schemaVersion: 1,
      brand: {
        name: 'GrowthOS',
        descriptor: 'Self-Learning Marketing OS',
        description: 'A governed marketing operating system.',
      },
      navigation: [{ label: 'Product', href: '/product' }],
      primaryCta: { label: 'Request access', href: '/contact' },
      footer: {
        groups: [
          {
            title: 'Product',
            links: [{ label: 'Capabilities', href: '/product' }],
          },
        ],
        copyrightText: 'GrowthOS. Product capabilities follow the published contract.',
        governanceText: 'Human approval remains part of consequential execution.',
      },
    })
  })

  it('rejects unsafe public destinations', () => {
    expect(() =>
      createPublicSiteSnapshot({
        navigation: {
          brand: {
            name: 'GrowthOS',
            descriptor: 'Marketing OS',
            description: 'Description',
          },
          primaryNavigation: [{ label: 'Unsafe', href: 'javascript:alert(1)' }],
          primaryCta: { label: 'Contact', href: '/contact' },
        },
        footer: {
          groups: [{ title: 'Product', links: [{ label: 'Home', href: '/' }] }],
          copyrightText: 'GrowthOS',
        },
      }),
    ).toThrow('site-relative or HTTPS')
  })
})
