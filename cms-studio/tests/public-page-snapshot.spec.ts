import { describe, expect, it } from 'vitest'
import { createPublicPageSnapshot, createPublicPagesSnapshot } from '../src/publishing/public-page-snapshot'

const lexicalParagraph = {
  root: {
    type: 'root',
    version: 1,
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', version: 1, text: 'Evidence-backed content.' }],
      },
    ],
  },
}

describe('public page snapshot', () => {
  it('normalizes the controlled CMS block library into a portable release contract', () => {
    const page = createPublicPageSnapshot({
      slug: 'solutions/growth',
      title: 'Growth solution',
      metaTitle: 'Growth solution',
      metaDescription: 'A sufficiently descriptive CMS-managed marketing page for GrowthOS.',
      indexable: true,
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Solution',
          heading: 'Coordinate marketing around a business outcome.',
          body: 'Use governed evidence and approvals.',
          primaryCta: { label: 'Request access', href: '/contact' },
        },
        {
          blockType: 'featureGrid',
          heading: 'Capabilities',
          items: [{ title: 'Evidence', description: 'Use verified signals before action.' }],
        },
        { blockType: 'richText', content: lexicalParagraph },
        {
          blockType: 'callToAction',
          heading: 'Ready to continue?',
          label: 'Contact',
          href: '/contact',
        },
        {
          blockType: 'form',
          heading: 'Request access',
          form: { id: 'cms-id', formId: 'request-access' },
        },
      ],
    })

    expect(page.slug).toBe('solutions/growth')
    expect(page.blocks).toHaveLength(5)
    expect(page.blocks[2]).toEqual({
      blockType: 'richText',
      text: 'Evidence-backed content.',
    })
    expect(page.blocks[4]).toEqual({
      blockType: 'form',
      heading: 'Request access',
      formId: 'request-access',
    })
  })

  it('rejects reserved and duplicate public routes', () => {
    const docs = [
      { slug: 'contact', title: 'Contact', layout: [] },
      { slug: 'contact', title: 'Duplicate', layout: [] },
    ]
    expect(() => createPublicPagesSnapshot(docs, new Set(['/contact']))).toThrow(
      'conflicts with a reserved public route',
    )
  })

  it('rejects unsupported page blocks instead of silently dropping content', () => {
    expect(() =>
      createPublicPageSnapshot({
        slug: 'custom',
        title: 'Custom',
        layout: [{ blockType: 'arbitraryHtml', html: '<script>alert(1)</script>' }],
      }),
    ).toThrow('Unsupported published page block type')
  })
})
