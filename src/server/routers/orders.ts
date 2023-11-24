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
    .query('getByUserId', {
      input: z.object({
        userId: z.string(),
        page: z.number(),
        pageSize: z.number()
      }),
      async resolve({ctx, input}) {
        const response = await getOrdersByUserId(input)
        return {error: null, success: true, orders: response.orders}
      }
    })
    .query('test', {
      async resolve({ctx, input}) {
        console.log('hmmm')
        return {error: null, success: true}
      }
    })
)
