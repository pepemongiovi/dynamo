import db from '../db'

export const findVariantsByProductIds = async (productIds: string[]) => {
  const variants = await db.variant.findMany({
    where: {productId: {in: productIds}}
  })

  return {
    status: 200,
    variants
  }
}
