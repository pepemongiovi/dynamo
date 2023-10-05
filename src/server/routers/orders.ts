import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {getOffersByProductId} from '../controllers/offers'
import {createOrderSchema} from '@/validation'
import {createOrder} from '../controllers/orders'

export default createRouter().merge(
  createProtectedRouter().mutation('create', {
    input: createOrderSchema,
    async resolve({ctx, input}) {
      const result = await createOrder(input)
      return {...result}
    }
  })
)
