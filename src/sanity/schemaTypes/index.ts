import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { notes } from './notes'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, notes],
}
