import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

type UnknownRecord = Record<string, unknown>

export type PublicPageBlock =
  | {
      blockType: 'hero'
      eyebrow?: string
      heading: string
      body?: string
      primaryCta?: { label: string; href: string }
    }
  | {
      blockType: 'featureGrid'
      heading?: string
      items: Array<{ title: string; description: string }>
    }
  | {
      blockType: 'richText'
      text: string
    }
  | {
      blockType: 'callToAction'
      heading: string
      body?: string
      label: string
      href: string
    }
  | {
      blockType: 'form'
      formId: string
      heading?: string
    }

export interface PublicPageSnapshot {
  slug: string
  title: string
  metaTitle?: string
  metaDescription?: string
  canonicalPath?: string
  indexable: boolean
  blocks: PublicPageBlock[]
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? (value as UnknownRecord) : {}
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Published page is missing ${field}`)
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
    // Report one stable contract error below.
  }

  throw new Error(`${field} must be site-relative or HTTPS`)
}

function canonicalPath(value: unknown): string | undefined {
  const path = optionalString(value)
  if (!path) return undefined
  if (path.startsWith('/') && !path.startsWith('//')) return path
  throw new Error('canonicalPath must be site-relative')
}

function normalizeSlug(value: unknown): string {
  const slug = requiredString(value, 'slug').replace(/^\/+|\/+$/g, '')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug)) {
    throw new Error(`Published page slug "${slug}" must use lowercase kebab-case path segments`)
  }
  return slug
}

function normalizeBlock(value: unknown, index: number): PublicPageBlock {
  const block = asRecord(value)
  const type = requiredString(block.blockType, `layout[${index}].blockType`)

  if (type === 'hero') {
    const primaryCta = asRecord(block.primaryCta)
    const ctaLabel = optionalString(primaryCta.label)
    const ctaHref = optionalString(primaryCta.href)
    if ((ctaLabel && !ctaHref) || (!ctaLabel && ctaHref)) {
      throw new Error(`layout[${index}].primaryCta requires both label and href`)
    }

    return {
      blockType: 'hero',
      heading: requiredString(block.heading, `layout[${index}].heading`),
      ...(optionalString(block.eyebrow) ? { eyebrow: optionalString(block.eyebrow) } : {}),
      ...(optionalString(block.body) ? { body: optionalString(block.body) } : {}),
      ...(ctaLabel && ctaHref
        ? {
            primaryCta: {
              label: ctaLabel,
              href: destination(ctaHref, `layout[${index}].primaryCta.href`),
            },
          }
        : {}),
    }
  }

  if (type === 'featureGrid') {
    if (!Array.isArray(block.items) || block.items.length === 0) {
      throw new Error(`layout[${index}].items must contain at least one feature`)
    }
    return {
      blockType: 'featureGrid',
      ...(optionalString(block.heading) ? { heading: optionalString(block.heading) } : {}),
      items: block.items.map((value, itemIndex) => {
        const item = asRecord(value)
        return {
          title: requiredString(item.title, `layout[${index}].items[${itemIndex}].title`),
          description: requiredString(
            item.description,
            `layout[${index}].items[${itemIndex}].description`,
          ),
        }
      }),
    }
  }

  if (type === 'richText') {
    const content = block.content
    if (!content || typeof content !== 'object') {
      throw new Error(`layout[${index}].content must contain Lexical rich text`)
    }

    const text = convertLexicalToPlaintext({ data: content as SerializedEditorState }).trim()
    if (!text) {
      throw new Error(`layout[${index}].content must contain readable text`)
    }

    return {
      blockType: 'richText',
      text,
    }
  }

  if (type === 'callToAction') {
    return {
      blockType: 'callToAction',
      heading: requiredString(block.heading, `layout[${index}].heading`),
      ...(optionalString(block.body) ? { body: optionalString(block.body) } : {}),
      label: requiredString(block.label, `layout[${index}].label`),
      href: destination(block.href, `layout[${index}].href`),
    }
  }

  if (type === 'form') {
    const form = asRecord(block.form)
    return {
      blockType: 'form',
      formId: requiredString(form.formId, `layout[${index}].form.formId`),
      ...(optionalString(block.heading) ? { heading: optionalString(block.heading) } : {}),
    }
  }

  throw new Error(`Unsupported published page block type: ${type}`)
}

export function createPublicPageSnapshot(doc: unknown): PublicPageSnapshot {
  const page = asRecord(doc)
  if (!Array.isArray(page.layout)) {
    throw new Error('Published page layout must be an array')
  }

  const canonical = canonicalPath(page.canonicalPath)

  return {
    slug: normalizeSlug(page.slug),
    title: requiredString(page.title, 'title'),
    ...(optionalString(page.metaTitle) ? { metaTitle: optionalString(page.metaTitle) } : {}),
    ...(optionalString(page.metaDescription)
      ? { metaDescription: optionalString(page.metaDescription) }
      : {}),
    ...(canonical ? { canonicalPath: canonical } : {}),
    indexable: page.indexable !== false,
    blocks: page.layout.map(normalizeBlock),
  }
}

export function createPublicPagesSnapshot(
  docs: unknown[],
  reservedPaths: ReadonlySet<string>,
) {
  const pages = docs.map(createPublicPageSnapshot)
  const seen = new Set<string>()

  for (const page of pages) {
    const route = `/${page.slug}`
    if (reservedPaths.has(route)) {
      throw new Error(`CMS page route "${route}" conflicts with a reserved public route`)
    }
    if (seen.has(route)) {
      throw new Error(`CMS page route "${route}" is duplicated`)
    }
    seen.add(route)
  }

  return {
    schemaVersion: 1 as const,
    pages,
  }
}
