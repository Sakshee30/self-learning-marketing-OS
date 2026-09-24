export function validateSiteDestination(value: unknown): true | string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'A destination is required.'
  }

  const destination = value.trim()

  if (destination.startsWith('/') && !destination.startsWith('//')) {
    return true
  }

  try {
    const url = new URL(destination)
    return url.protocol === 'https:' ? true : 'External destinations must use HTTPS.'
  } catch {
    return 'Use a site-relative path or a valid HTTPS URL.'
  }
}

export function validateSiteRelativePath(value: unknown): true | string {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Use a site-relative path.'

  const path = value.trim()
  return path.startsWith('/') && !path.startsWith('//')
    ? true
    : 'Use a site-relative path beginning with "/".'
}
