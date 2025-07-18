import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "v2021-03-25",
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
