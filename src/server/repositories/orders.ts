import {ObjectId} from 'mongodb'
import db from '../db'
import {ICreateOrder, IUpdateOrder, IGetOrdersByUserId} from '@/validation'
import {Offer, OfferDetails, Order, OrderStatus, Variant} from '@prisma/client'

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
  const {id, offers, ...updatedOrder} = {...input, offers: input.offers || []}

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

  await db.offerDetails.deleteMany({where: {orderId: id}})

  await db.offerDetails.createMany({
    data: offers?.map((details) => ({
      offerId: details.offerId,
      orderId: id,
      variantIds: details.variantsInfo
    }))
  })

  return {
    status: 200,
    order: null as any,
    message: 'Pedido atualizado com sucesso!'
  }
}

export const cancelOrdersByIds = async (ids: string[]) => {
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

export const fetchOrderById = async (id: string) => {
  const order = await db.order.findFirst({
    where: {id},
    include: {offers: true}
  })

  if (!order) {
    throw new Error(`Pedido não encontrado.`)
  }

  let orderData = {...order}

  for (let i = 0; i < orderData.offers.length; i++) {
    const offerDetails = orderData.offers[i]
    if (offerDetails) {
      const offer = await db.offer.findFirst({
        where: {id: offerDetails.offerId}
      })

      orderData.offers[i] = {
        ...offerDetails,
        ...offer
      } as OfferDetails & Offer
    }
  }

  const variantIds = orderData.offers.reduce((allVariantIds, offer) => {
    const variantIdsNotAdded = offer.variantIds
      .map((variant) => variant.variantId)
      .filter((id) => !allVariantIds.includes(id))

    return [...allVariantIds, ...variantIdsNotAdded]
  }, [] as string[])

  const variants: Variant[] = []

  for (let i = 0; i < variantIds.length; i++) {
    const variant = await db.variant.findFirst({
      where: {id: variantIds[i]},
      include: {product: true}
    })
    variants.push(variant as Variant)
  }

  // orderData = orderData.offers.map((offer) => ({
  //   ...offer,
  //   variants: variantIds.map((variantId) =>
  //     variants.find((variant) => variant.id === variantId)
  //   ) as Variant[]
  // }))

  return {
    status: 200,
    variants,
    order: {...orderData, offers: orderData.offers as (OfferDetails & Offer)[]},
    message: 'Pedido encontrado'
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
