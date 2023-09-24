import * as z from 'zod'

export const offerVariantSchema = z.object({
  variantId: z.string(),
  amount: z.number().positive()
})

export const offerSchema = z.object({
  name: z.string(),
  variants: z.array(offerVariantSchema)
})
