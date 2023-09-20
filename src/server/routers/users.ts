import {z} from 'zod'
import createRouter, {createProtectedRouter} from '../createRouter'
import db from '../db'

export default createRouter().merge(
  createProtectedRouter()
    // .query('redirect', {
    //   input: z.object({
    //     email: z.string().optional()
    //   }),
    //   async resolve({ctx, input}) {}
    // })
    .mutation('getUserByEmail', {
      input: z.object({
        userEmail: z.string()
      }),
      async resolve({ctx, input}) {
        const user = await db.user.findFirst({
          where: {email: input.userEmail}
        })

        return {error: null, success: true, user}
      }
    })
    .mutation('createTestData', {
      async resolve({ctx, input}) {
        const userId = '65016102497edcb175c4ed9e'

        const product = await db.product.create({
          data: {
            name: 'Calcinha modeladora',
            userId,
            variants: [{color: 'Preto', size: 'M', count: 2}]
          },
          include: {
            user: true
          }
        })

        console.log('product', product)

        const offer = await db.offer.create({
          data: {
            count: 2,
            name: 'Compre 1 leve 2',
            variants: [
              {productId: product.id, color: 'Preto', size: 'M', count: 2}
            ]
          }
        })

        console.log('offer', offer)

        // const user = await db.user.findFirst({
        //   where: {id: userId},
        //   include: {products: true}
        // })
        // console.log(user)

        return {error: null, success: true}
      }
    })
)
