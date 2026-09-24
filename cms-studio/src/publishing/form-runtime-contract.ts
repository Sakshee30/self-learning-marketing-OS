import { createHash } from 'node:crypto'

type UnknownRecord = Record<string, unknown>

const FORM_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{1,63}$/
const FIELD_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/

export interface RuntimeFormOption {
  label: string
  value: string
}

export interface RuntimeFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox'
  required: boolean
  options?: RuntimeFormOption[]
  consentDecisionKey?: string
}

export interface RuntimeFormSchema {
  name?: string
  fields: RuntimeFormField[]
}

export interface PublishedFormPublication {
  formId: string
  sourceRevision: string
  schema: RuntimeFormSchema
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? (value as UnknownRecord) : {}
}

function requiredString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Published form is missing required ${fieldName}`)
  }
  return value.trim()
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function normalizeOption(value: unknown): RuntimeFormOption {
  const option = asRecord(value)
  return {
    label: requiredString(option.label, 'option label'),
    value: requiredString(option.value, 'option value'),
  }
}

function normalizeField(value: unknown): RuntimeFormField {
  const field = asRecord(value)
  const name = requiredString(field.name, 'field name')
  if (!FIELD_NAME_PATTERN.test(name)) {
    throw new Error(`Published form field name "${name}" is invalid`)
  }

  const type = requiredString(field.type, 'field type')
  if (!['text', 'email', 'textarea', 'select', 'checkbox'].includes(type)) {
    throw new Error(`Unsupported published form field type: ${type}`)
  }

  const normalized: RuntimeFormField = {
    name,
    label: requiredString(field.label, 'field label'),
    type: type as RuntimeFormField['type'],
    required: field.required === true,
  }

  if (Array.isArray(field.options) && field.options.length > 0) {
    normalized.options = field.options.map(normalizeOption)
  }
  if (normalized.type === 'select' && (!normalized.options || normalized.options.length === 0)) {
    throw new Error(`Published select field "${name}" requires at least one option`)
  }

  const consentDecisionKey = optionalString(field.consentDecisionKey)
  if (consentDecisionKey) normalized.consentDecisionKey = consentDecisionKey

  return normalized
}

export function createPublishedFormPublication(doc: unknown): PublishedFormPublication {
  const form = asRecord(doc)
  const formId = requiredString(form.formId, 'formId')
  if (!FORM_ID_PATTERN.test(formId)) {
    throw new Error(`Published formId "${formId}" is invalid`)
  }
  if (!Array.isArray(form.fields) || form.fields.length === 0) {
    throw new Error(`Published form "${formId}" has no fields`)
  }

  const fields = form.fields.map(normalizeField)
  const seenNames = new Set<string>()
  for (const field of fields) {
    if (seenNames.has(field.name)) {
      throw new Error(`Published form "${formId}" contains duplicate field "${field.name}"`)
    }
    seenNames.add(field.name)
  }

  const schema: RuntimeFormSchema = { fields }
  const name = optionalString(form.name)
  if (name) schema.name = name

  const sourceRevision = createHash('sha256').update(JSON.stringify(schema)).digest('hex')

  return { formId, sourceRevision, schema }
}
