import {findOffersByIds} from '@/server/repositories/offers'

export const getOffersByIds = async (offerIds: string[]) => {
  try {
    const result = await findOffersByIds(offerIds)
    return result
  } catch (error) {
    console.error(error)
    return {errors: String(error), offers: null}
  }
}
