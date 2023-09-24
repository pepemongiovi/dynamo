import * as z from 'zod'

export const productVariantSchema = z.object({
  productId: z.string(),
  amountAvailable: z.number().positive(),
  color: z.string().optional(),
  size: z.string().optional(),
  type: z.string().optional(),
  price: z.number()
})
