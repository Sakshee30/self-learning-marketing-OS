import { APIError, type GlobalBeforeChangeHook } from 'payload'
import { canPublishUser } from '@/access/roles'

export const enforceGlobalPublishingPermission: GlobalBeforeChangeHook = ({
  data,
  originalDoc,
  req,
}) => {
  const isPublishing = data?._status === 'published' && originalDoc?._status !== 'published'
  if (!isPublishing) return data

  if (!canPublishUser(req.user)) {
    throw new APIError('Publishing global website content requires reviewer/publisher permission.', 403)
  }

  return data
}
