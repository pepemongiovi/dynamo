import {patchOrder} from '@/server/repositories'
import {IUpdateOrder} from '@/validation'

export const updateOrder = async (input: IUpdateOrder) => {
  try {
    const order = await patchOrder(input)
    return order
  } catch (error) {
    console.error(error)
    return {errors: String(error), order: null}
  }
}
