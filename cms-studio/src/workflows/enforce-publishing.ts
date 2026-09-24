import { APIError, type CollectionBeforeChangeHook } from 'payload'
import { canPublishUser } from '@/access/roles'

const publishableEditorialStates = new Set(['approved', 'scheduled', 'published'])

export const enforcePublishingPermission: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  const isPublishing = data?._status === 'published' && originalDoc?._status !== 'published'
  if (!isPublishing) return data

  if (!canPublishUser(req.user)) {
    throw new APIError('Publishing requires reviewer/publisher permission.', 403)
  }

  if (!publishableEditorialStates.has(String(data.editorialStatus ?? ''))) {
    throw new APIError('Content must be approved or scheduled before it can be published.', 400)
  }

  return data
}
