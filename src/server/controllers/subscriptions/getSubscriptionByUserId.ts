import {findSubscriptionsByUserId} from '@/server/repositories/subscriptions'
import {getUserById} from '../users/getUserById'

export const getSubscriptionsByUserId = async (userId: string) => {
  try {
    const user = await getUserById({userId})

    if (!user) {
      return {
        status: 404,
        error: `No user found with id ${userId}`,
        subscriptions: []
      }
    }
    const result = await findSubscriptionsByUserId(userId)
    return result
  } catch (error) {
    console.error(error)
    return {errors: String(error), data: null}
  }
}
