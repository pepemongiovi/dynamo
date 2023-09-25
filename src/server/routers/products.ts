import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {getProductsByUserId} from '../controllers/products'

export default createRouter().merge(
  createProtectedRouter().mutation('getByUserId', {
    input: z.object({
      userId: z.string()
    }),
    async resolve({ctx, input}) {
      const products = await getProductsByUserId(input.userId)

      return {error: null, success: true, products}
    }
  })
)
