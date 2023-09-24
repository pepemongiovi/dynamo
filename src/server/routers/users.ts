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
        const variants = [
          {color: 'Preto', size: 'P', amountAvailable: 100},
          {color: 'Preto', size: 'M', amountAvailable: 59},
          {color: 'Preto', size: 'G', amountAvailable: 22}
        ]
        const product = await db.product.create({
          data: {
            name: 'Calcinha modeladora',
            userId,
            variants: {
              create: variants.map(({size, color, amountAvailable}) => ({
                color,
                size,
                amountAvailable,
                price: 59.6
              }))
            }
          },
          include: {
            variants: true
          }
        })

        const other_product = await db.product.create({
          data: {
            name: 'Calcinha modeladora',
            userId,
            variants: {
              create: variants.map(({size, color, amountAvailable}) => ({
                color,
                size,
                amountAvailable,
                price: 59.6
              }))
            }
          },
          include: {
            variants: true
          }
        })

        console.log('product', product)

        const offer = await db.offer.create({
          data: {
            name: 'Compre 2 leve 3',
            variants: product.variants
              .map((variant) => ({
                variantId: variant.id,
                amount: 1
              }))
              .slice(0, 2)
          }
        })

        const other_offer = await db.offer.create({
          data: {
            name: '(2) Calcinha modeladora + (1) Shorte empina bumbum',
            variants: [
              ...other_product.variants
                .map((variant) => ({
                  variantId: variant.id,
                  amount: 1
                }))
                .slice(0, 1),
              ...product.variants
                .map((variant) => ({
                  variantId: variant.id,
                  amount: 2
                }))
                .slice(0, 1)
            ]
          }
        })

        console.log('offer', offer)

        const order = await db.order.create({
          data: {
            userId,
            offerIds: [offer.id, other_offer.id],
            address: {
              address: 'Av. Oceano Pacífico',
              city: 'Campina Grande',
              district: 'Intermares',
              number: 500,
              state: 'Paraíba',
              zipcode: '58102236',
              complement: 'Do lado da quadra'
            },
            date: new Date(),
            phone: '83999972096'
          }
        })

        console.log(order)

        // const user = await db.user.findFirst({
        //   where: {id: userId},
        //   include: {products: true}
        // })
        // console.log(user)

        return {error: null, success: true}
      }
    })
)
