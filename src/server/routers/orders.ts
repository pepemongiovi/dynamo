import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {createOrderSchema, updateOrderSchema} from '@/validation'
import {createOrder} from '../controllers/orders'
import {getOrdersByUserId} from '../controllers/orders/getOrdersByUserId'
import {updateOrder} from '../controllers/orders/updateOrder'
import {updateOrdersStatus} from '../controllers/orders/updateOrdersStatus'
import {getOrderById} from '../controllers/orders/getOrderById'

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
        return {
          error: null,
          success: true,
          orders: response.orders,
          count: response.count
        }
      }
    })

    .query('getById', {
      input: z.object({
        id: z.string()
      }),
      async resolve({ctx, input}) {
        const response = await getOrderById(input.id)
        return {
          error: null,
          success: true,
          order: response.order
        }
      }
    })
    .mutation('update', {
      input: updateOrderSchema,
      async resolve({ctx, input}) {
        const response = await updateOrder(input)
        return {error: null, success: true, order: response.order}
      }
    })
    .mutation('updateOrdersStatus', {
      input: z.object({
        ids: z.array(z.string())
      }),
      async resolve({ctx, input}) {
        await updateOrdersStatus(input.ids)
        return {error: null, success: true}
      }
    })
)
