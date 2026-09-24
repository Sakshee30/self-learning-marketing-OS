import type { CollectionConfig } from 'payload'
import {
  canCreateContent,
  canDeleteContent,
  canUpdateContent,
  isAuthenticated,
  userHasAnyRole,
} from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    group: 'Content',
    defaultColumns: ['filename', 'rightsStatus', 'updatedAt'],
  },
  access: {
    create: canCreateContent,
    delete: canDeleteContent,
    read: ({ req }) => {
      if (req.user) return true
      return {
        rightsStatus: {
          equals: 'approved',
        },
      }
    },
    update: canUpdateContent,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      maxLength: 320,
      admin: {
        description: 'Describe the purpose of the asset for visitors who cannot see it.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      maxLength: 1000,
    },
    {
      name: 'rightsStatus',
      type: 'select',
      required: true,
      defaultValue: 'unreviewed',
      options: ['unreviewed', 'approved', 'restricted'],
    },
    {
      name: 'rightsOwner',
      type: 'text',
      maxLength: 160,
    },
    {
      name: 'rightsExpiresAt',
      type: 'date',
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      access: {
        read: ({ req }) => userHasAnyRole(req.user, ['website-admin', 'marketing-manager', 'reviewer-publisher']),
        update: ({ req }) => userHasAnyRole(req.user, ['website-admin', 'marketing-manager', 'reviewer-publisher']),
      },
    },
  ],
}
