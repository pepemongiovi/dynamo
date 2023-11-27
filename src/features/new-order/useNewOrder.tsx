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

export default function useNewOrder() {
  const {data} = useSession()

  const {isLoading, ...loader} = useLoader()

  const [isZipcodeInvalid, setIsZipcodeInvalid] = useState(false)
  const [newOfferModalOpened, setNewOfferModalOpened] = useState(false)
  const [editingOfferIdx, setEditingOfferIdx] = useState<number | null>(null)

  const [products, setProducts] = useState<(Product & {offers: Offer[]})[]>([])

  const getUserSubscriptions = trpc.useMutation(['subscriptions.getByUserId'])
  const createOrder = trpc.useMutation(['orders.create'])

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
    complement: ''
  }

  const {
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setValue,
    setError,
    clearErrors,
    control,
    reset,
    watch
  } = useFormHook<ICreateOrder>({
    defaultValues: {
      name: '',
      offers: [] as OfferData[],
      phone: '',
      observations: '',
      addressInfo: emptyAddress,
      shift: '',
      date: new Date()
    }
  })

  const offers = watch('offers')
  const zipcode = watch('addressInfo.zipcode')

  console.log('offers', offers)

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

  useEffect(() => {
    autofillAddress()
  }, [debouncedSearchTerm])

  const onSubmit = useCallback(
    loader.action(async ({offers, ...newOrder}: ICreateOrder) => {
      try {
        const res = await createOrder.mutateAsync({
          ...newOrder,
          offers: offers.map((offer) => ({
            ...offer,
            variantsInfo: offer.variantsInfo.map(({variantId, amount}) => ({
              variantId,
              amount
            }))
          })),
          userId: data?.user.id as string,
          addressInfo: {
            ...newOrder.addressInfo,
            number: Number(newOrder.addressInfo.number)
          }
        })
        if (res.order?.id) {
          toast.success('Seu pedido foi agendado!')
          // reset()
        } else {
          throw new Error()
        }
        console.log(3, res)
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

  return {
    isZipcodeInvalid,
    control,
    shiftOpts,
    statesOpts,
    offers,
    products,
    newOfferModalOpened,
    editingOfferIdx,
    isLoading,
    isValid,
    handleOfferUpdate,
    onEditOffer,
    setNewOfferModalOpened,
    handleNewOffer,
    handleRemoveOffer,
    onSubmit: handleSubmit(onSubmit)
  }
}
