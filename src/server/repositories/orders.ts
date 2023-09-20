import db from '../db'
import {Prisma} from '@prisma/client'
import {ICreateOrder} from '@/validation'

export const createNewOrder = async (input: ICreateOrder) => {
  const {name, phone, address, date, userId} = input

  const userExists = await db.user.findFirst({
    where: {id: userId}
  })
  if (userExists) {
    throw new Error(`Usuário de id "${userId}" não encontrado.`)
  }

  const data: ICreateOrder = {
    name: 'testname',
    phone: 'testPhone',
    address: {
      address: 'address',
      city: 'CG',
      district: 'intermares',
      number: '22',
      state: 'PB',
      zipcode: '58102236',
      complement: 'some complement'
    },
    date: new Date(),
    userId: '65016102497edcb175c4ed9e',
    offers: [
      {
        count: 1,
        name: 'Compra 1 leva 2',
        variants: [
          {
            productId: '1',
            count: 2,
            color: 'Preto',
            size: 'M'
          }
        ]
      }
    ]
  }
  const order = await db.order.create({data: data as any})

  return {
    status: 201,
    message: 'Account created successfully',
    result: order
  }
}
