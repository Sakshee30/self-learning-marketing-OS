import { describe, expect, it } from 'vitest'
import { createPublishedFormPublication } from '../src/publishing/form-runtime-contract'

describe('published form runtime contract', () => {
  it('strips Payload row metadata and produces a stable revision digest', () => {
    const first = createPublishedFormPublication({
      id: 'cms-doc-1',
      name: 'Request access',
      formId: 'request-access',
      updatedAt: '2026-09-24T00:00:00.000Z',
      fields: [
        {
          id: 'row-1',
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          consentDecisionKey: null,
        },
        {
          id: 'row-2',
          name: 'size',
          label: 'Team size',
          type: 'select',
          required: false,
          options: [
            { id: 'option-1', label: '1-10', value: '1-10' },
          ],
        },
      ],
    })

    const second = createPublishedFormPublication({
      id: 'different-cms-id',
      name: 'Request access',
      formId: 'request-access',
      updatedAt: '2026-09-25T00:00:00.000Z',
      fields: [
        {
          id: 'different-row-id',
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
        {
          name: 'size',
          label: 'Team size',
          type: 'select',
          required: false,
          options: [{ label: '1-10', value: '1-10' }],
        },
      ],
    })

    expect(first.schema).toEqual({
      name: 'Request access',
      fields: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        {
          name: 'size',
          label: 'Team size',
          type: 'select',
          required: false,
          options: [{ label: '1-10', value: '1-10' }],
        },
      ],
    })
    expect(first.sourceRevision).toBe(second.sourceRevision)
  })

  it('changes the revision when runtime behavior changes', () => {
    const first = createPublishedFormPublication({
      name: 'Contact',
      formId: 'contact',
      fields: [{ name: 'email', label: 'Email', type: 'email', required: true }],
    })
    const second = createPublishedFormPublication({
      name: 'Contact',
      formId: 'contact',
      fields: [{ name: 'email', label: 'Email', type: 'email', required: false }],
    })

    expect(first.sourceRevision).not.toBe(second.sourceRevision)
  })
})
