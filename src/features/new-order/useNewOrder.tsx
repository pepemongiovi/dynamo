import useLoader from '@/hooks/useLoader'
import {useCallback, useEffect, useState} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import {signIn} from 'next-auth/react'
import {Variant, shiftOpts, statesOpts} from '@/types/utils'
import {Offer, Product} from '@prisma/client'

export default function useNewOrder() {
  const {isLoading, ...loader} = useLoader()

  const [newVariantModalOpened, setNewVariantModalOpened] = useState(false)

  const [products, setProducts] = useState<(Product & {offers: Offer[]})[]>([
    {
      id: '1',
      name: 'Calcinha modeladora',
      offers: [{id: '1', name: 'Compre 1 leve 2'}]
    }
  ])

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
        console.log(err)
      }
    }),
    []
  )

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
