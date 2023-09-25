import {NextAuthOptions} from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import Credentials from 'next-auth/providers/credentials'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import db from '@/server/db'
import {loginSchema} from '@/validation/auth'
import {verify} from 'argon2'
import {requireEnv} from '@/server/utils'
import {createTransport} from 'nodemailer'
import {signInEmailHTMLString, textEmail} from './email/template'

const port = requireEnv('EMAIL_SERVER_PORT')
const jwtSecret = requireEnv('JWT_SECRET')

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: port ? Number(port) : 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async (params) => {
        const {identifier, url, provider, theme} = params
        const {host} = new URL(url)
        const transport = createTransport(provider.server)
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: textEmail({url, host}),
          html: signInEmailHTMLString({url, host, theme})
        })
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
        }
      }
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'text'},
        password: {label: 'Password', type: 'password'}
      },
      authorize: async (credentials) => {
        const creds = await loginSchema.parseAsync(credentials)

        const user = await db.user.findFirst({
          where: {email: creds.email}
        })
        if (!user) return null

        const isValidPassword = await verify(
          user.password ?? '',
          creds.password ?? ''
        )
        if (!isValidPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({session, token}) {
      session.user = token.user as any
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: jwtSecret,
  jwt: {
    maxAge: 15 * 24 * 30 * 120 // 30 days
  },
  pages: {
    signIn: '/app/login'
  }
}
