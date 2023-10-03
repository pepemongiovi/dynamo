import {findVariantsByProductIds} from '@/server/repositories/variants'

export const getVariantsByProductIds = async (productIds: string[]) => {
  try {
    const variants = await findVariantsByProductIds(productIds)
    return variants
  } catch (error) {
    console.error(error)
    return {errors: String(error), variants: null}
  }
}
