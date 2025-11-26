import { type SchemaTypeDefinition } from 'sanity'
import { product, submission, user } from '../schema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, submission, user],
}
