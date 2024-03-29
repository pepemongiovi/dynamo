import * as z from 'zod'
import {productVariantSchema} from './products'
import {offerSchema} from './offers'
import {OrderStatusEnum, orderStatusOpts} from '@/types/utils'
import {OrderStatus} from '@prisma/client'

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
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  addressInfo: addressSchema,
  userId: z.string(),
  offers: z.array(offerSchema),
  shift: z.string(),
  observations: z.string().optional(),
  date: z.date(),
  commission: z.number(),
  status: z.enum(orderStatusOpts as [string, ...string[]])
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

export const updateOrderSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  offers: z.array(offerData).optional(),
  phone: z.string().optional(),
  addressInfo: addressSchema.optional(),
  shift: z.string().optional(),
  observations: z.string().optional(),
  date: z.date().optional(),
  commission: z.number().optional(),
  status: z.enum(orderStatusOpts as [string, ...string[]]).optional()
})

export const getOrdersByUserId = z.object({
  userId: z.string(),
  page: z.number(),
  pageSize: z.number()
})

export type OrderData = z.infer<typeof orderSchema>
export type OfferData = z.infer<typeof offerData>
export type ICreateOrder = z.infer<typeof createOrderSchema>
export type IUpdateOrder = z.infer<typeof updateOrderSchema>
export type IGetOrdersByUserId = z.infer<typeof getOrdersByUserId>
