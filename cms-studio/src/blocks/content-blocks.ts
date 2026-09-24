import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'eyebrow', type: 'text', maxLength: 80 },
    { name: 'heading', type: 'text', required: true, maxLength: 180 },
    { name: 'body', type: 'textarea', maxLength: 1200 },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', maxLength: 80 },
        { name: 'href', type: 'text', maxLength: 2048 },
      ],
    },
  ],
}

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  fields: [
    { name: 'heading', type: 'text', maxLength: 180 },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 120 },
        { name: 'description', type: 'textarea', required: true, maxLength: 800 },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [{ name: 'content', type: 'richText', required: true }],
}

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  fields: [
    { name: 'heading', type: 'text', required: true, maxLength: 180 },
    { name: 'body', type: 'textarea', maxLength: 800 },
    { name: 'label', type: 'text', required: true, maxLength: 80 },
    { name: 'href', type: 'text', required: true, maxLength: 2048 },
  ],
}

export const FormBlock: Block = {
  slug: 'form',
  interfaceName: 'FormBlock',
  fields: [
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'heading', type: 'text', maxLength: 180 },
  ],
}

export const controlledContentBlocks = [HeroBlock, FeatureGridBlock, RichTextBlock, CallToActionBlock, FormBlock]
