import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import createRouter, {createContext} from '../createRouter'
import {verifyRecaptcha} from '../recaptcha'
import auth from './auth'
import {requireEnv} from '../utils'
import users from './users'
import products from './products'
import subscriptions from './subscriptions'
import offers from './offers'
import variants from './variants'
import orders from './orders'

const environment = requireEnv('ENVIRONMENT')

const waitFor = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const router = createRouter()
  .query('public.slow-query-cached', {
    async resolve({ctx}) {
      await waitFor(5000) // wait for 5s
      return {
        lastUpdated: new Date().toJSON()
      }
    }
  })
  .middleware(async ({type, ctx, path, next}) => {
    if (!ctx.isSameOrigin) {
      throw new trpc.TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cross-origin request not allowed'
      })
    }

    if (type === 'mutation') {
      if (ctx.recaptchaToken == null) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'reCAPTCHA token required'
        })
      }

      const isRecaptchVerified = await verifyRecaptcha(
        'api_update',
        ctx.recaptchaToken,
        ctx.ip
      )
      if (!isRecaptchVerified) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'reCAPTCHA verification failed'
        })
      }
    }
    return next()
  })
  .merge('auth.', auth)
  .merge('users.', users)
  .merge('products.', products)
  .merge('subscriptions.', subscriptions)
  .merge('offers.', offers)
  .merge('variants.', variants)
  .merge('orders.', orders)

export type AppRouter = typeof router

export default trpcNext.createNextApiHandler({
  router,
  createContext,
  responseMeta({ctx, paths, type, errors}) {
    // assuming you have all your public routes with the keyword `public` in them
    const allPublic = paths && paths.every((path) => path.includes('public'))
    // checking that no procedures errored
    const allOk = errors.length === 0
    // checking we're doing a query request
    const isQuery = type === 'query'
    if (ctx?.res && allPublic && allOk && isQuery) {
      // cache request for 1 day + revalidate once every second
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24
      return {
        headers: {
          'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
        }
      }
    }
    return {}
  }
})
