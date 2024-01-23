import {cancelOrdersByIds} from '@/server/repositories'

export const cancelOrders = async (ids: string[]) => {
  try {
    const order = await cancelOrdersByIds(ids)
    return order
  } catch (error) {
    console.error(error)
    return {errors: String(error), order: null}
  }
}
