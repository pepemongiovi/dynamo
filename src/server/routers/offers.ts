import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {getOffersByProductId} from '../controllers/offers'

export default createRouter().merge(
  createProtectedRouter().mutation('getByProductId', {
    input: z.object({
      productId: z.string()
    }),
    async resolve({ctx, input}) {
      const result = await getOffersByProductId(input.productId)
      return {...result}
    }
  })
)
