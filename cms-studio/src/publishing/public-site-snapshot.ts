type UnknownRecord = Record<string, unknown>

export interface PublicSiteLink {
  label: string
  href: string
}

export interface PublicSiteSnapshot {
  schemaVersion: 1
  brand: {
    name: string
    descriptor: string
    description: string
  }
  navigation: PublicSiteLink[]
  primaryCta: PublicSiteLink
  footer: {
    groups: Array<{
      title: string
      links: PublicSiteLink[]
    }>
    copyrightText: string
    governanceText?: string
  }
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? (value as UnknownRecord) : {}
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Published site content is missing ${field}`)
  }
  return value.trim()
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function destination(value: unknown, field: string): string {
  const href = requiredString(value, field)
  if (href.startsWith('/') && !href.startsWith('//')) return href

  try {
    const url = new URL(href)
    if (url.protocol === 'https:') return url.toString()
  } catch {
    // Report the stable contract error below.
  }

  throw new Error(`${field} must be site-relative or HTTPS`)
}

function link(value: unknown, field: string): PublicSiteLink {
  const item = asRecord(value)
  return {
    label: requiredString(item.label, `${field}.label`),
    href: destination(item.href, `${field}.href`),
  }
}

export function createPublicSiteSnapshot(input: {
  navigation: unknown
  footer: unknown
}): PublicSiteSnapshot {
  const navigationDoc = asRecord(input.navigation)
  const brand = asRecord(navigationDoc.brand)
  const primaryCta = asRecord(navigationDoc.primaryCta)
  const footerDoc = asRecord(input.footer)

  if (!Array.isArray(navigationDoc.primaryNavigation)) {
    throw new Error('Published site content is missing primaryNavigation')
  }
  if (!Array.isArray(footerDoc.groups) || footerDoc.groups.length === 0) {
    throw new Error('Published site content is missing footer groups')
  }

  return {
    schemaVersion: 1,
    brand: {
      name: requiredString(brand.name, 'brand.name'),
      descriptor: requiredString(brand.descriptor, 'brand.descriptor'),
      description: requiredString(brand.description, 'brand.description'),
    },
    navigation: navigationDoc.primaryNavigation.map((item, index) =>
      link(item, `primaryNavigation[${index}]`),
    ),
    primaryCta: {
      label: requiredString(primaryCta.label, 'primaryCta.label'),
      href: destination(primaryCta.href, 'primaryCta.href'),
    },
    footer: {
      groups: footerDoc.groups.map((value, groupIndex) => {
        const group = asRecord(value)
        if (!Array.isArray(group.links) || group.links.length === 0) {
          throw new Error(`footer.groups[${groupIndex}] must contain links`)
        }
        return {
          title: requiredString(group.title, `footer.groups[${groupIndex}].title`),
          links: group.links.map((item, linkIndex) =>
            link(item, `footer.groups[${groupIndex}].links[${linkIndex}]`),
          ),
        }
      }),
      copyrightText: requiredString(footerDoc.copyrightText, 'footer.copyrightText'),
      ...(optionalString(footerDoc.governanceText)
        ? { governanceText: optionalString(footerDoc.governanceText) }
        : {}),
    },
  }
}
