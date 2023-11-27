import {fetchOrdersByUserId} from '@/server/repositories'
import {IGetOrdersByUserId} from '@/validation'

export const getOrdersByUserId = async (input: IGetOrdersByUserId) => {
  try {
    const response = await fetchOrdersByUserId(input)
    return response
  } catch (error) {
    console.error(error)
    return {errors: String(error), orders: null, count: null, success: false}
  }
}
