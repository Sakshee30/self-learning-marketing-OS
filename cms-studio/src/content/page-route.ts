export function validatePageSlug(value: unknown): true | string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'A page slug is required.'
  }

  const slug = value.trim().replace(/^\/+|\/+$/g, '')
  return /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug)
    ? true
    : 'Use lowercase kebab-case path segments, for example "solutions/growth-teams".'
}
