import db from '../db'

export const findProductsByUserId = async (userId: string) => {
  const user = await db.user.findFirst({
    where: {id: userId},
    select: {products: true}
  })

  return {
    status: 200,
    products: user?.products
  }
}
