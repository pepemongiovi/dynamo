import {createNewOrder} from '@/server/repositories'
import {ICreateOrder} from '@/validation'

export const createOrder = async (input: ICreateOrder) => {
  try {
    const order = await createNewOrder(input)
    return order
  } catch (error) {
    console.error(error)
    return {errors: String(error), order: null}
  }
}
