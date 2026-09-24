import type { CollectionConfig } from 'payload'
import { canCreateContent, canDeleteContent, canUpdateContent, isAuthenticated } from '@/access/roles'
import { queuePublishedFormVersion } from '@/publishing/queue-published-form-version'
import { enforcePublishingPermission } from '@/workflows/enforce-publishing'

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'name',
    group: 'Marketing',
    defaultColumns: ['name', 'formId', 'editorialStatus', '_status', 'updatedAt'],
  },
  access: {
    create: canCreateContent,
    delete: canDeleteContent,
    read: isAuthenticated,
    readVersions: isAuthenticated,
    update: canUpdateContent,
  },
  hooks: {
    beforeChange: [enforcePublishingPermission],
    afterChange: [queuePublishedFormVersion],
  },
  versions: {
    maxPerDoc: 100,
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 160 },
    { name: 'formId', type: 'text', required: true, unique: true, index: true, maxLength: 64 },
    {
      name: 'editorialStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'review', 'approved', 'scheduled', 'published', 'refresh'],
    },
    {
      name: 'fields',
      type: 'array',
      minRows: 1,
      maxRows: 50,
      required: true,
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 64 },
        { name: 'label', type: 'text', required: true, maxLength: 160 },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: ['text', 'email', 'textarea', 'select', 'checkbox'],
        },
        { name: 'required', type: 'checkbox', defaultValue: false },
        {
          name: 'options',
          type: 'array',
          maxRows: 50,
          fields: [
            { name: 'label', type: 'text', required: true, maxLength: 120 },
            { name: 'value', type: 'text', required: true, maxLength: 120 },
          ],
        },
        {
          name: 'consentDecisionKey',
          type: 'text',
          maxLength: 64,
          admin: { description: 'Optional key resolved by approved consent policy. This field does not define legal meaning.' },
        },
      ],
    },
  ],
}
