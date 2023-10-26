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
  addressInfo: addressSchema,
  userId: z.string(),
  offers: z.array(offerSchema),
  observations: z.string().optional(),
  date: z.date()
})

export const offerData = z.object({
  name: z.string().optional(),
  offerId: z.string(),
  productId: z.string(),
  variantsInfo: z.array(
    z.object({
      variantId: z.string(),
      name: z.string().optional(),
      amount: z.number(),
      price: z.number().optional()
    })
  )
})

export const createOrderSchema = z.object({
  name: z.string(),
  offers: z.array(offerData),
  phone: z.string(),
  addressInfo: addressSchema,
  userId: z.string(),
  shift: z.string(),
  observations: z.string().optional(),
  date: z.date()
})

export type OfferData = z.infer<typeof offerData>
export type ICreateOrder = z.infer<typeof createOrderSchema>
