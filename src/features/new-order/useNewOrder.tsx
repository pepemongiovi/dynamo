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
import {OfferData} from '@/components/offers/SelectOfferModal'

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

  const [newOfferModalOpened, setNewOfferModalOpened] = useState(false)
  const [editingOfferIdx, setEditingOfferIdx] = useState<number | null>(null)

  const [products, setProducts] = useState<(Product & {offers: Offer[]})[]>([])

  const getUserSubscriptions = trpc.useMutation(['subscriptions.getByUserId'])

  const onEditOffer = (offerIdx: number) => {
    setEditingOfferIdx(offerIdx)
    setNewOfferModalOpened(true)
  }

  const {
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setValue,
    setError,
    clearErrors,
    control,
    watch
  } = useFormHook({
    defaultValues: {
      offers: [] as OfferData[],
      name: '',
      phone: '',
      addressInfo: {
        zipcode: '',
        address: '',
        number: '',
        district: '',
        city: '',
        state: '',
        complement: ''
      },
      shift: '',
      date: new Date()
    }
  })

  const offers = watch('offers')

  const handleNewOffer = (data: OfferData) => {
    setValue('offers', [...offers, data])
    setNewOfferModalOpened(false)
  }

  const handleRemoveOffer = (offerIdx: number) => {
    setValue(
      'offers',
      offers.filter((_, idx) => idx !== offerIdx)
    )
  }

  const onSubmit = useCallback(
    loader.action(async (data) => {
      try {
        console.log(3, data)
        clearErrors()
      } catch (err) {
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
    control,
    shiftOpts,
    statesOpts,
    offers,
    products,
    newOfferModalOpened,
    editingOfferIdx,
    onEditOffer,
    setNewOfferModalOpened,
    handleNewOffer,
    handleRemoveOffer,
    onSubmit: handleSubmit(onSubmit)
  }
}
