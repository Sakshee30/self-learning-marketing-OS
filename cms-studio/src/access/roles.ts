import type { Access } from 'payload'

export const studioRoles = [
  'website-admin',
  'marketing-manager',
  'editor',
  'reviewer-publisher',
  'seo-manager',
  'analyst',
  'auditor',
] as const

export type StudioRole = (typeof studioRoles)[number]

interface StudioUserLike {
  role?: StudioRole | null
}

function roleOf(user: unknown): StudioRole | undefined {
  if (!user || typeof user !== 'object') return undefined
  return (user as StudioUserLike).role ?? undefined
}

export function userHasAnyRole(user: unknown, roles: readonly StudioRole[]): boolean {
  const role = roleOf(user)
  return role !== undefined && roles.includes(role)
}

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const canManageUsers: Access = ({ req }) => userHasAnyRole(req.user, ['website-admin'])

export const canCreateContent: Access = ({ req }) =>
  userHasAnyRole(req.user, [
    'website-admin',
    'marketing-manager',
    'editor',
    'reviewer-publisher',
    'seo-manager',
  ])

export const canUpdateContent: Access = ({ req }) => {
  if (userHasAnyRole(req.user, ['website-admin', 'marketing-manager', 'reviewer-publisher'])) return true

  if (userHasAnyRole(req.user, ['editor', 'seo-manager'])) {
    return {
      _status: {
        not_equals: 'published',
      },
    }
  }

  return false
}

export const canDeleteContent: Access = ({ req }) =>
  userHasAnyRole(req.user, ['website-admin', 'marketing-manager'])

export const canPublishUser = (user: unknown): boolean =>
  userHasAnyRole(user, ['website-admin', 'marketing-manager', 'reviewer-publisher'])

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}
