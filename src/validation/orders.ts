import * as z from 'zod'
import {productVariantSchema} from './products'
import {offerSchema} from './offers'

export const addressSchema = z.object({
  zipcode: z.string(),
  state: z.string(),
  city: z.string(),
  district: z.string(),
  address: z.string(),
  number: z.number().int(),
  complement: z.string().optional()
})

export const orderSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: addressSchema,
  userId: z.string(),
  offers: z.array(offerSchema),
  date: z.date()
})

export const createOrderSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: addressSchema,
  userId: z.string(),
  offerIds: z.array(z.string()),
  date: z.date()
})

export type ICreateOrder = z.infer<typeof createOrderSchema>
