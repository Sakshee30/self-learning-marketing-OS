import type { CollectionAfterChangeHook } from 'payload'
import { createPublishedFormPublication } from '@/publishing/form-runtime-contract'

export const queuePublishedFormVersion: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc?._status !== 'published') return doc

  const publication = createPublishedFormPublication(doc)

  if (previousDoc?._status === 'published') {
    const previousPublication = createPublishedFormPublication(previousDoc)
    if (previousPublication.sourceRevision === publication.sourceRevision) {
      return doc
    }
  }

  await req.payload.jobs.queue({
    task: 'syncPublishedFormVersion',
    queue: 'form-publication',
    input: publication,
    req,
  })

  return doc
}
