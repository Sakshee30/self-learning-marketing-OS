import type { CollectionConfig } from 'payload'
import { canManageUsers, isAuthenticated, studioRoles, userHasAnyRole } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  access: {
    create: canManageUsers,
    delete: canManageUsers,
    read: isAuthenticated,
    update: ({ req, id }) => {
      if (req.user?.id === id) return true
      return userHasAnyRole(req.user, ['website-admin'])
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: studioRoles.map((role) => ({ label: role.replaceAll('-', ' '), value: role })),
      saveToJWT: true,
    },
    { name: 'displayName', type: 'text', maxLength: 120 },
  ],
}
