import type { GlobalConfig } from 'payload'
import { userHasAnyRole } from '@/access/roles'
import { validateSiteDestination } from '@/content/site-link'
import { enforceGlobalPublishingPermission } from '@/workflows/enforce-global-publishing'

export const SiteNavigation: GlobalConfig = {
  slug: 'site-navigation',
  label: 'Site navigation',
  admin: {
    group: 'Website',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    readVersions: ({ req }) => Boolean(req.user),
    update: ({ req }) =>
      userHasAnyRole(req.user, [
        'website-admin',
        'marketing-manager',
        'editor',
        'reviewer-publisher',
      ]),
  },
  hooks: {
    beforeChange: [enforceGlobalPublishingPermission],
  },
  versions: {
    max: 100,
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
  },
  fields: [
    {
      name: 'brand',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 80 },
        { name: 'descriptor', type: 'text', required: true, maxLength: 120 },
        { name: 'description', type: 'textarea', required: true, maxLength: 500 },
      ],
    },
    {
      name: 'primaryNavigation',
      type: 'array',
      maxRows: 12,
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 80 },
        {
          name: 'href',
          type: 'text',
          required: true,
          maxLength: 2048,
          validate: validateSiteDestination,
        },
        { name: 'trackingId', type: 'text', maxLength: 100 },
      ],
    },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 80 },
        {
          name: 'href',
          type: 'text',
          required: true,
          maxLength: 2048,
          validate: validateSiteDestination,
        },
      ],
    },
  ],
}
