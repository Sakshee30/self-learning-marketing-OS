import type { CollectionConfig } from 'payload'
import {
  canCreateContent,
  canDeleteContent,
  canUpdateContent,
  publishedOrAuthenticated,
} from '@/access/roles'
import { controlledContentBlocks } from '@/blocks/content-blocks'
import { validatePageSlug } from '@/content/page-route'
import { validateSiteRelativePath } from '@/content/site-link'
import { enforcePublishingPermission } from '@/workflows/enforce-publishing'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'editorialStatus', '_status', 'updatedAt'],
  },
  access: {
    create: canCreateContent,
    delete: canDeleteContent,
    read: publishedOrAuthenticated,
    readVersions: publishedOrAuthenticated,
    update: canUpdateContent,
  },
  hooks: {
    beforeChange: [enforcePublishingPermission],
  },
  versions: {
    maxPerDoc: 100,
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 180,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      maxLength: 180,
      validate: validatePageSlug,
    },
    {
      name: 'editorialStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['idea', 'brief', 'draft', 'review', 'approved', 'scheduled', 'published', 'refresh'],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content Brief',
          fields: [
            { name: 'audience', type: 'textarea', maxLength: 1000 },
            { name: 'visitorProblem', type: 'textarea', maxLength: 1500 },
            { name: 'intent', type: 'textarea', maxLength: 1000 },
            { name: 'mainPromise', type: 'textarea', maxLength: 1000 },
            { name: 'evidence', type: 'textarea', maxLength: 2500 },
            { name: 'primaryCallToAction', type: 'text', maxLength: 180 },
            { name: 'secondaryNextStep', type: 'text', maxLength: 180 },
            { name: 'contentOwner', type: 'relationship', relationTo: 'users' },
            { name: 'reviewDueAt', type: 'date' },
            { name: 'conversionEvent', type: 'text', maxLength: 128 },
            { name: 'approvalRequirements', type: 'textarea', maxLength: 1500 },
          ],
        },
        {
          label: 'Page',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: controlledContentBlocks,
              maxRows: 80,
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text', maxLength: 180 },
            { name: 'metaDescription', type: 'textarea', maxLength: 500 },
            {
              name: 'canonicalPath',
              type: 'text',
              maxLength: 2048,
              validate: validateSiteRelativePath,
              admin: {
                description: 'Use a validated site-relative canonical route. External canonical handling is a later policy layer.',
              },
            },
            {
              name: 'indexable',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
}
