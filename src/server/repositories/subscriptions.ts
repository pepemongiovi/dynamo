import db from '../db'

export const findSubscriptionsByUserId = async (userId: string) => {
  const subscriptions = await db.productSubscription.findMany({
    where: {userId},
    include: {product: true}
  })

  return {
    status: 200,
    subscriptions: subscriptions.map((product) => product.product)
  }
}
