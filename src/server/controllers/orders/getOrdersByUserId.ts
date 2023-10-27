import {fetchOrdersByUserId} from '@/server/repositories'
import {IGetOrdersByUserId} from '@/validation'

export const getOrdersByUserId = async (input: IGetOrdersByUserId) => {
  try {
    const orders = await fetchOrdersByUserId(input)
    return orders
  } catch (error) {
    console.error(error)
    return {errors: String(error), orders: null}
  }
}
