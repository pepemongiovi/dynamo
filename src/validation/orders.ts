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
  date: z.date()
})

export const offerData = z.object({
  name: z.string(),
  variantsInfo: z.object({
    variantId: z.string(),
    name: z.string(),
    amount: z.number()
  }),
  details: z.object({
    offerId: z.string(),
    productId: z.string(),
    variantIds: z.array(
      z.object({
        variantId: z.string(),
        amount: z.number()
      })
    )
  })
})

export type OfferData = {
  name: string
  variantsInfo: {
    variantId: string
    name: string
    amount: number
  }[]
  details: {
    offerId: string
    variantIds: {variantId: string; amount: number}[]
    productId: string
  }
}

export const createOrderSchema = z.object({
  offers: z.array(offerData),
  name: z.string(),
  phone: z.string(),
  addressInfo: offerData,
  userId: z.string(),
  shift: z.string(),
  date: z.date()
})

export type ICreateOrder = z.infer<typeof createOrderSchema>
