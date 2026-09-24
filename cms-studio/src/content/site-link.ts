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
