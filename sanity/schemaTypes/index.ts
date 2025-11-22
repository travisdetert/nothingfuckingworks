import { type SchemaTypeDefinition } from 'sanity'
import { product, submission } from '../schema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, submission],
}
