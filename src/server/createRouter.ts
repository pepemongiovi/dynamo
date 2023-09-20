import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import {NextApiRequest} from 'next'
import superjson from 'superjson'
import getIp from './ip'

type Meta = {
  recaptchaAction?: string
}
export default function createRouter() {
  return trpc.router<Context, Meta>().transformer(superjson)
}

export function createProtectedRouter() {
  return createRouter().middleware(async ({ctx, next}) => {
    return next({ctx})
  })
}

export async function createContext({
  req,
  res
}: trpcNext.CreateNextContextOptions) {
  return {
    req,
    res,
    ip: getIp(req),
    isSameOrigin: req.headers['x-same-origin'] === '1',
    recaptchaToken: getFirstHeader(req, 'x-recaptcha-token')
  }
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

function getFirstHeader(req: NextApiRequest, key: string): string | undefined {
  const value = req.headers[key]
  return Array.isArray(value) ? value[0] : value
}
