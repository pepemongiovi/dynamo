import { createNewOrder } from '@/server/repositories'
import {ICreateOrder} from '@/validation'

export const createOrder = async (input: ICreateOrder) => {
  try {
    const user = await createNewOrder(input)
    return user
  } catch (error) {
    console.error(error)
    return {errors: String(error), data: null}
  }
}
