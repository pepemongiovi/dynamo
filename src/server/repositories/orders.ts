import {ObjectId} from 'mongodb'
import db from '../db'
import {ICreateOrder, IUpdateOrder, IGetOrdersByUserId} from '@/validation'
import {Order, OrderStatus} from '@prisma/client'

export const createNewOrder = async (input: ICreateOrder) => {
  const {offers, ...body} = input

  const userExists = await db.user.findFirst({
    where: {id: input.userId}
  })

  if (!userExists) {
    throw new Error(`Usuário de id "${input.userId}" não encontrado.`)
  }

  const order = await db.order.create({
    data: {
      ...body,
      status: 'scheduled',
      commission: 10.6,
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

export const patchOrder = async (input: IUpdateOrder) => {
  const {id, offers, ...updatedOrder} = input

  const orderExists = await db.order.findFirst({
    where: {id}
  })

  if (!orderExists) {
    throw new Error(`Pedido não encontrado.`)
  }

  await db.order.update({
    where: {id},
    data: updatedOrder as Order
  })

  return {
    status: 200,
    order: null as any,
    message: 'Pedido atualizado com sucesso!'
  }
}

export const updateOrdersStatusByIds = async (ids: string[]) => {
  await db.order.updateMany({
    where: {id: {in: ids}},
    data: {status: OrderStatus.canceled}
  })

  return {
    status: 200,
    order: null as any,
    message: 'Pedidos atualizados com sucesso!'
  }
}

export const fetchOrdersByUserId = async ({
  userId,
  page,
  pageSize
}: IGetOrdersByUserId) => {
  const userExists = await db.user.findFirst({
    where: {id: userId}
  })
  if (!userExists) {
    throw new Error(`Usuário de id "${userId}" não encontrado.`)
  }

  let count: number | null
  if (page === 1) {
    count = await db.order.count({where: {userId}})
  } else {
    count = null
  }
  const orders = await db.order.findMany({
    where: {userId},
    include: {offers: true},
    skip: (page - 1) * pageSize,
    take: pageSize
  })

  const offerIds: string[] = []

  orders.forEach((order) => {
    order.offers.forEach((offer) => {
      if (!offerIds.includes(offer.id)) {
        offerIds.push(offer.offerId)
      }
    })
  })

  const offers = await db.offer.findMany({
    where: {id: {in: offerIds}},
    select: {id: true, name: true}
  })

  const result = orders.map((order) => {
    return {
      ...order,
      offers: order.offers.map((offer) => {
        const offerName = offers.find(({id}) => offer.offerId === id)?.name
        return {...offer, name: offerName}
      })
    }
  })

  return {
    status: 200,
    orders: result,
    count,
    message: 'Orders fetched successfully'
  }
}
