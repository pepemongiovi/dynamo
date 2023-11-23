import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {getOffersByProductId} from '../controllers/offers'
import {getOffersByIds} from '../controllers/offers/getOffersByIds'

export default createRouter().merge(
  createProtectedRouter()
    .mutation('getByProductId', {
      input: z.object({
        productId: z.string()
      }),
      async resolve({ctx, input}) {
        const result = await getOffersByProductId(input.productId)
        return {...result}
      }
    })
    .mutation('getByIds', {
      input: z.object({
        offerIds: z.array(z.string())
      }),
      async resolve({ctx, input}) {
        const result = await getOffersByIds(input.offerIds)
        return {...result}
      }
    })
)
