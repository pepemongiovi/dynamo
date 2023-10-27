import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {createOrderSchema} from '@/validation'
import {createOrder} from '../controllers/orders'
import {getOrdersByUserId} from '../controllers/orders/getOrdersByUserId'

export default createRouter().merge(
  createProtectedRouter()
    .mutation('create', {
      input: createOrderSchema,
      async resolve({ctx, input}) {
        const result = await createOrder(input)
        return {...result}
      }
    })
    .mutation('getByUserId', {
      input: z.object({
        userId: z.string()
      }),
      async resolve({ctx, input}) {
        const response = await getOrdersByUserId({userId: input.userId})
        return {error: null, success: true, orders: response.orders}
      }
    })
)
