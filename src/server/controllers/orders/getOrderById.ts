import {fetchOrderById} from '@/server/repositories'
import {Offer, OfferDetails} from '@prisma/client'

export const getOrderById = async (id: string) => {
  try {
    const response = await fetchOrderById(id)
    return response
  } catch (error) {
    console.error(error)
    return {
      errors: String(error),
      order: null,
      variants: null,
      count: null,
      success: false
    }
  }
}
