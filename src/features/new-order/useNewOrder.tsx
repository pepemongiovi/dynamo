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

  const [products, setProducts] = useState<(Product & {offers: Offer[]})[]>([])

  const getUserSubscriptions = trpc.useMutation(['subscriptions.getByUserId'])

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
      offers: [] as {
        name: string
        variantsNames: string[]
        details: Omit<OfferDetails, 'id' | 'orderId'>
      }[],
      name: '',
      phone: '',
      zipcode: '',
      address: '',
      number: '',
      district: '',
      city: '',
      state: '',
      complement: '',
      shift: '',
      date: new Date()
    }
  })

  const offers = watch('offers')

  const handleNewOffer = (
    offer: Omit<OfferDetails, 'id' | 'orderId'>,
    offerName: string,
    variantsNames: string[]
  ) => {
    setValue('offers', [
      ...offers,
      {name: offerName, variantsNames, details: offer}
    ])
  }

  const handleRemoveOffer = (tag: string) => {
    // setValue(
    //   'offers',
    //   offers.filter((offer) => {
    //     return getVariantName(variant) !== tag
    //   })
    // )
  }

  const onSubmit = useCallback(
    loader.action(async () => {
      try {
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
    setNewOfferModalOpened,
    handleNewOffer,
    handleRemoveOffer,
    onSubmit: handleSubmit(onSubmit)
  }
}
