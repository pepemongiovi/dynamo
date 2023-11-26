import {updateOrdersStatusByIds} from '@/server/repositories'

export const updateOrdersStatus = async (ids: string[]) => {
  try {
    const order = await updateOrdersStatusByIds(ids)
    return order
  } catch (error) {
    console.error(error)
    return {errors: String(error), order: null}
  }
}
