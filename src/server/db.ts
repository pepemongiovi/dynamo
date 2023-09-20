import {PrismaClient} from '@prisma/client'
import {URL} from 'url'
import {requireEnv} from './utils'

declare global {
  var prismaClient: PrismaClient | undefined
}

const db_url = new URL(requireEnv('DATABASE_URL'))

export default global.prismaClient ??= (() => {
  const client = new PrismaClient({
    datasources: {db: {url: db_url.toString()}}
  })

  return client
})()
