import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import {getSubscriptionsByUserId} from '../controllers/subscriptions'

export default createRouter().merge(
  createProtectedRouter().mutation('getByUserId', {
    input: z.object({
      userId: z.string()
    }),
    async resolve({ctx, input}) {
      const result = await getSubscriptionsByUserId(input.userId)
      return {...result}
    }
  })
)
