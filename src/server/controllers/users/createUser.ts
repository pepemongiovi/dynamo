import {createNewUser} from '@/server/repositories'
import {ISignUp} from '@/validation'

export const createUser = async (input: ISignUp) => {
  try {
    const user = await createNewUser(input)
    return user
  } catch (error) {
    console.error(error)
    return {errors: String(error), user: null}
  }
}
