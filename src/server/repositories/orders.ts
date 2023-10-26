import db from '../db'
import {Prisma} from '@prisma/client'
import {ICreateOrder} from '@/validation'

export const createNewOrder = async (input: ICreateOrder) => {
  const {offers, ...body} = input

  const userExists = await db.user.findFirst({
    where: {id: input.userId}
  })
  console.log(userExists)
  console.log(input.userId)
  if (!userExists) {
    throw new Error(`Usuário de id "${input.userId}" não encontrado.`)
  }

  const order = await db.order.create({
    data: {
      ...body,
      offers: {
        create: offers?.map((details) => ({
          offerId: details.offerId,
          variantIds: details.variantsInfo
        }))
      }
    }
  })

  return {
    status: 201,
    order,
    message: 'Account created successfully'
  }
}
