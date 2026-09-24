import type { GlobalConfig } from 'payload'
import { userHasAnyRole } from '@/access/roles'
import { validateSiteDestination } from '@/content/site-link'
import { enforceGlobalPublishingPermission } from '@/workflows/enforce-global-publishing'

export const SiteFooter: GlobalConfig = {
  slug: 'site-footer',
  label: 'Site footer',
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
      name: 'groups',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 80 },
        {
          name: 'links',
          type: 'array',
          minRows: 1,
          maxRows: 16,
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
    },
    { name: 'copyrightText', type: 'text', required: true, maxLength: 220 },
    { name: 'governanceText', type: 'text', maxLength: 220 },
  ],
}
