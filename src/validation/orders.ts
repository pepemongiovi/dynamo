import * as z from 'zod'
import {productVariantSchema} from './products'

export const addressSchema = z.object({
  zipcode: z.string(),
  state: z.string(),
  city: z.string(),
  district: z.string(),
  address: z.string(),
  number: z.string(),
  complement: z.string().optional()
})

export const offerSchema = z.object({
  name: z.string(),
  count: z.number().positive(),
  variants: z.array(productVariantSchema)
})

export const createOrderSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: addressSchema,
  userId: z.string(),
  offers: z.array(offerSchema),
  date: z.date()
})

export type ICreateOrder = z.infer<typeof createOrderSchema>
