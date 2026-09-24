import { createHash } from 'node:crypto'

type UnknownRecord = Record<string, unknown>

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
  const type = requiredString(field.type, 'field type')
  if (!['text', 'email', 'textarea', 'select', 'checkbox'].includes(type)) {
    throw new Error(`Unsupported published form field type: ${type}`)
  }

  const normalized: RuntimeFormField = {
    name: requiredString(field.name, 'field name'),
    label: requiredString(field.label, 'field label'),
    type: type as RuntimeFormField['type'],
    required: field.required === true,
  }

  if (Array.isArray(field.options) && field.options.length > 0) {
    normalized.options = field.options.map(normalizeOption)
  }

  const consentDecisionKey = optionalString(field.consentDecisionKey)
  if (consentDecisionKey) normalized.consentDecisionKey = consentDecisionKey

  return normalized
}

export function createPublishedFormPublication(doc: unknown): PublishedFormPublication {
  const form = asRecord(doc)
  const formId = requiredString(form.formId, 'formId')
  if (!Array.isArray(form.fields) || form.fields.length === 0) {
    throw new Error(`Published form "${formId}" has no fields`)
  }

  const schema: RuntimeFormSchema = {
    fields: form.fields.map(normalizeField),
  }
  const name = optionalString(form.name)
  if (name) schema.name = name

  const sourceRevision = createHash('sha256').update(JSON.stringify(schema)).digest('hex')

  return { formId, sourceRevision, schema }
}
