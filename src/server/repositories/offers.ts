import db from '../db'

export const findOffersByProductId = async (productId: string) => {
  const offers = await db.offer.findMany({
    where: {products: {some: {productId}}}
  })

  return {
    status: 200,
    offers
  }
}
