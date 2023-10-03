import {findOffersByProductId} from '@/server/repositories/offers'

export const getOffersByProductId = async (productId: string) => {
  try {
    const result = await findOffersByProductId(productId)
    return result
  } catch (error) {
    console.error(error)
    return {errors: String(error), offers: null}
  }
}
