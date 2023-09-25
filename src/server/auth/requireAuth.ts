import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next'
import {getServerSession} from 'next-auth'
import {nextAuthOptions} from '.'

export type LoginCredentials = {
  email?: string
  password?: string
}

export const checkIfLoggedIn = async (ctx: {
  req: NextApiRequest
  res: NextApiResponse
}) => {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions)
  if (session) {
    return true
  }
  return false
}

export const getSession = async (ctx: {
  req: NextApiRequest
  res: NextApiResponse
}) => {
  return await getServerSession(ctx.req, ctx.res, nextAuthOptions)
}

export const requireAuth =
  (func: GetServerSideProps) =>
  async (ctx: GetServerSidePropsContext & {user: LoginCredentials | null}) => {
    ctx.user = null
    const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions)

    if (session) {
      ctx.user = {email: session.user?.email ?? undefined}
      return await func(ctx)
    }
    return {
      redirect: {
        destination: '/app/login',
        permanent: false
      },
      props: {user: null}
    }
  }
