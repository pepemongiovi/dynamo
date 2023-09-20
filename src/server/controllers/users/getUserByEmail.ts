import {findUserByEmail} from '@/server/repositories'
import {IGetUserByEmail} from '@/validation'

export const getUserByEmail = async (input: IGetUserByEmail) => {
  try {
    const user = await findUserByEmail(input)
    return user
  } catch (error) {
    console.error(error)
    return {errors: String(error), data: null}
  }
}
