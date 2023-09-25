import useLoader from '@/hooks/useLoader'
import {useCallback, useEffect, useState} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import {signIn, useSession} from 'next-auth/react'
import {Variant, shiftOpts, statesOpts} from '@/types/utils'
import {Offer, Product, ProductSubscription} from '@prisma/client'
import trpc from '@/utils/trpc'

export default function useNewOrder() {
  const {data} = useSession()

  const {isLoading, ...loader} = useLoader()

  const [newVariantModalOpened, setNewVariantModalOpened] = useState(false)

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
      variants: [] as Variant[],
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

  const variants = watch('variants')

  const getVariantName = ({productId, offerId, color, size}: Variant) => {
    const product = products.find(
      (product: Product) => product.id === productId
    )
    const offer = product?.offers.find((offer) => offer.id === offerId)

    const firstPart = `${offer?.name} - ${product?.name}`
    const secondPart = color || size ? `(${`${color} `}${size})` : ''

    return `${firstPart} ${secondPart}`
  }

  const handleNewVariant = (newVariant: Variant) => {
    const {variants} = getValues()
    setValue('variants', [...variants, newVariant])
    setNewVariantModalOpened(false)
  }

  const handleRemoveVariant = (tag: string) => {
    const {variants} = getValues()
    setValue(
      'variants',
      variants.filter((variant) => {
        return getVariantName(variant) !== tag
      })
    )
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
        setProducts(res.subscriptions)
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
    errors,
    isLoading,
    isValid,
    variants,
    products,
    newVariantModalOpened,
    setNewVariantModalOpened,
    handleNewVariant,
    handleRemoveVariant,
    onSubmit: handleSubmit(onSubmit),
    getValues,
    setValue,
    setError,
    clearErrors,
    getVariantName
  }
}
