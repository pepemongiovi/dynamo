import {findProductsByUserId} from '@/server/repositories/products'

export const getProductsByUserId = async (userId: string) => {
  try {
    const user = await findProductsByUserId(userId)
    return user
  } catch (error) {
    console.error(error)
    return {errors: String(error), data: null}
  }
}
