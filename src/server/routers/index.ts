import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import createRouter, {createContext} from '../createRouter'
import {verifyRecaptcha} from '../recaptcha'
import auth from './auth'
import {requireEnv} from '../utils'
import users from './users'

const environment = requireEnv('ENVIRONMENT')

const router = createRouter()
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

export type AppRouter = typeof router

export default trpcNext.createNextApiHandler({router, createContext})
