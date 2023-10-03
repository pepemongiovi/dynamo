import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {getVariantsByProductIds} from '../controllers/variants'

export default createRouter().merge(
  createProtectedRouter().mutation('getByProductIds', {
    input: z.object({
      productIds: z.array(z.string())
    }),
    async resolve({ctx, input}) {
      const result = await getVariantsByProductIds(input.productIds)
      return {...result}
    }
  })
)
