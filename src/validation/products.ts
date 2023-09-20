import * as z from 'zod'

export const productVariantSchema = z.object({
  productId: z.string(),
  count: z.number().positive(),
  color: z.string(),
  size: z.string()
})
