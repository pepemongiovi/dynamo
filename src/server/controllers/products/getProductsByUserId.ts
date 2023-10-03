import {findProductsByUserId} from '@/server/repositories/products'

export const getProductsByUserId = async (userId: string) => {
  try {
    const products = await findProductsByUserId(userId)
    return products
  } catch (error) {
    console.error(error)
    return {errors: String(error), products: null}
  }
}
