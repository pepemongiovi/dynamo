import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import db from '../db'
import {getUserByEmail} from '../controllers/users/getUserByEmail'
import {getUserById} from '../controllers/users/getUserById'

export default createRouter().merge(
  createProtectedRouter()
    .mutation('getByEmail', {
      input: z.object({
        userEmail: z.string()
      }),
      async resolve({ctx, input}) {
        const user = await getUserByEmail({email: input.userEmail})
        return {error: null, success: true, user}
      }
    })
    .mutation('getById', {
      input: z.object({
        userId: z.string()
      }),
      async resolve({ctx, input}) {
        const user = await getUserById({userId: input.userId})
        return {error: null, success: true, user}
      }
    })
)
