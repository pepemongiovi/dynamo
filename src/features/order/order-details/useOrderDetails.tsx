import useLoader from '@/hooks/useLoader'
import {useCallback, useEffect, useState} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import {signIn, useSession} from 'next-auth/react'
import {shiftOpts, statesOpts} from '@/types/utils'
import {
  Offer,
  OfferDetails,
  Product,
  ProductSubscription,
  Variant
} from '@prisma/client'
import trpc from '@/utils/trpc'
import {ICreateOrder, OfferData} from '@/validation'
import {findAddress} from '@/services/viacep-api'
import {useDebounce} from '@/hooks/useDebounce'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'

export const getVariantLabel = (variant: Variant, productName: string) => {
  const sizeLabel = `Tamanho ${variant.size}`
  const colorLabel = `${variant.color}`

  const variantLabel =
    variant.size && variant.color
      ? `${sizeLabel}: ${colorLabel}`
      : variant.size
      ? sizeLabel
      : colorLabel

  return `${productName} - ${variantLabel}`
}

export default function useOrderDetails(editMode: boolean) {
  const router = useRouter()
  const {id} = router.query

  const {data} = useSession()
  const {isLoading, ...loader} = useLoader()

  const [orderToEditFetched, setOrderToEditFetched] = useState(false)
  const [isZipcodeInvalid, setIsZipcodeInvalid] = useState(false)
  const [newOfferModalOpened, setNewOfferModalOpened] = useState(false)
  const [editingOfferIdx, setEditingOfferIdx] = useState<number | null>(null)

  const [products, setProducts] = useState<(Product & {offers: Offer[]})[]>([])

  const getUserSubscriptions = trpc.useMutation(['subscriptions.getByUserId'])
  const {isLoading: isCreatingOrder, mutateAsync: createOrder} =
    trpc.useMutation(['orders.create'])
  const getOrderById = trpc.useQuery(
    ['orders.getById', {id: (id as string) || ''}],
    {enabled: !!id}
  )

  const {isLoading: isUpdatingOrder, mutateAsync: updateOrder} =
    trpc.useMutation(['orders.update'])

  const onAddNewOffer = () => {
    setEditingOfferIdx(null)
    setNewOfferModalOpened(true)
  }

  const onEditOffer = (offerIdx: number) => {
    setEditingOfferIdx(offerIdx)
    setNewOfferModalOpened(true)
  }

  const emptyAddress = {
    zipcode: '',
    address: '',
    number: undefined as any,
    district: '',
    city: '',
    state: '',
    complement: '',
    status: ''
  }

  const {
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
    setValue,
    clearErrors,
    control,
    watch
  } = useFormHook<ICreateOrder>({
    defaultValues: {
      name: '',
      offers: [] as OfferData[],
      phone: '',
      observations: '',
      addressInfo: emptyAddress as any,
      shift: '',
      status: '',
      date: new Date()
    }
  })

  const offers = watch('offers')
  const zipcode = watch('addressInfo.zipcode')

  const debouncedSearchTerm = useDebounce(zipcode, 800)

  const handleNewOffer = (data: OfferData) => {
    setValue('offers', [...offers, data])
    setNewOfferModalOpened(false)
  }

  const handleOfferUpdate = (updatedOffer: OfferData) => {
    setValue(
      'offers',
      offers.map((offer, idx) =>
        idx === editingOfferIdx ? updatedOffer : offer
      )
    )
    setNewOfferModalOpened(false)
  }

  const handleRemoveOffer = (offerIdx: number) => {
    setValue(
      'offers',
      offers.filter((_, idx) => idx !== offerIdx)
    )
  }

  const autofillAddress = async () => {
    try {
      if (!zipcode) return
      if (zipcode.length !== 9) throw new Error()

      const address = await findAddress(zipcode)
      if (address.logradouro) {
        setValue('addressInfo', {
          zipcode,
          address: address.logradouro,
          number: undefined as any,
          district: address.bairro,
          city: address.localidade,
          state: address.uf,

          complement: address.complemento || getValues('addressInfo.complement')
        })
        setIsZipcodeInvalid(false)
      } else {
        throw new Error()
      }
    } catch (err) {
      setIsZipcodeInvalid(true)
      setValue('addressInfo.address', emptyAddress.address)
      setValue('addressInfo.number', emptyAddress.number)
      setValue('addressInfo.district', emptyAddress.district)
      setValue('addressInfo.city', emptyAddress.city)
      setValue('addressInfo.state', emptyAddress.state)
      setValue('addressInfo.complement', emptyAddress.complement)
    }
  }

  const onSubmit = useCallback(
    loader.action(async ({offers, ...newOrder}: ICreateOrder) => {
      try {
        const updatedAddress = {
          ...newOrder.addressInfo,
          number: Number(newOrder.addressInfo.number)
        }
        const updatedOffers = offers.map((offer) => ({
          ...offer,
          variantsInfo: offer.variantsInfo.map(({variantId, amount}) => ({
            variantId,
            amount
          }))
        }))

        let res

        if (editMode && id) {
          res = await updateOrder({
            id: id as string,
            ...newOrder,
            offers: updatedOffers,
            addressInfo: updatedAddress
          })
        } else {
          res = await createOrder({
            ...newOrder,
            offers: updatedOffers,
            userId: data?.user.id as string,
            addressInfo: updatedAddress
          })
        }

        if (res.success) {
          toast.success(
            `Seu pedido foi ${editMode ? 'atualizado' : 'agendado'}!`
          )
          if (!id) {
            reset()
          }
        } else {
          throw new Error()
        }
        clearErrors()
      } catch (err) {
        toast.error('Ocorreu um erro ao agendar seu pedido. Tente mais tarde')
        console.error(err)
      }
    }),
    []
  )

  const loadAllProducts = async () => {
    if (data) {
      const res = await getUserSubscriptions.mutateAsync({
        userId: data.user.id
      })
      if (res.subscriptions) {
        setProducts(res.subscriptions as any)
      }
    }
  }

  useEffect(() => {
    loadAllProducts()
  }, [data])

  useEffect(() => {
    if (!editMode || (editMode && orderToEditFetched)) {
      autofillAddress()
    } else if (zipcode) {
      setOrderToEditFetched(true)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    const order = getOrderById.data?.order
    const variants = getOrderById.data?.variants

    if (order && variants) {
      setValue('name', order.name)
      setValue('date', order.date)
      setValue('phone', order.phone)
      setValue('shift', order.shift)
      setValue('status', order.status)
      setValue('observations', order.observations || '')
      setValue('addressInfo', {
        ...order.addressInfo,
        complement: order.addressInfo.complement || ''
      })

      setValue(
        'offers',
        order.offers.map((offer) => ({
          name: offer.name,
          offerId: offer.offerId,
          productId: offer.products[0]?.productId || '',
          variantsInfo: (offer.variantIds
            .map((variant) => {
              const data = variants.find(({id}) => id === variant.variantId)
              if (!data) return null

              return {
                variantId: data.id,
                name: (data as any).product.name,
                amount: variant.amount,
                price: data.price
              }
            })
            .filter((offer) => !!offer) || []) as any
        }))
      )
    }
  }, [getOrderById.data])

  return {
    id,
    isZipcodeInvalid,
    control,
    shiftOpts,
    statesOpts,
    offers,
    products,
    newOfferModalOpened,
    editingOfferIdx,
    isLoading,
    isValid: editMode ? !Object.keys(errors).length : isValid,
    onAddNewOffer,
    handleOfferUpdate,
    onEditOffer,
    setNewOfferModalOpened,
    handleNewOffer,
    handleRemoveOffer,
    onSubmit: handleSubmit(onSubmit)
  }
}
