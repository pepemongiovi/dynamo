import {findUserById} from '@/server/repositories'
import {IGetUserByUserId} from '@/validation'

export const getUserById = async (input: IGetUserByUserId) => {
  try {
    const user = await findUserById(input)
    return user
  } catch (error) {
    console.error(error)
    return {errors: String(error), user: null}
  }
}
