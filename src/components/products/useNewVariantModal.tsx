import useLoader from '@/hooks/useLoader'
import {Variant} from '@/types/utils'
import trpc from '@/utils/trpc'
import {Product} from '@prisma/client'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useForm} from 'react-hook-form'

type UseNewVariantModalProps = {
  onSubmit: (variant: Variant) => void
  products: Product[]
}

const useNewVariantModal = ({onSubmit, products}: UseNewVariantModalProps) => {
  const getByProductId = trpc.useMutation('offers.getByProductId')
  const {isLoading, ...loader} = useLoader()

  const [variants, setVariants] = useState([])
  const [offers, setOffers] = useState([])

  const {
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    clearErrors,
    control,
    watch
  } = useForm({
    defaultValues: {
      productId: '',
      offerId: '',
      variantId: ''
    }
  })

  const selectedProductId = watch('productId')
  const selectedOfferId = watch('offerId')

  const submit = useCallback(
    loader.action(async () => {
      try {
        clearErrors()
        onSubmit(getValues())
      } catch (err) {
        console.error(err)
      }
    }),
    []
  )

  const fetchOffers = async () => {
    const res = await getByProductId.mutateAsync({
      productId: selectedProductId
    })
    setOffers(res.offers)
  }

  const fetchVariants = async () => {
    const res = await getByProductId.mutateAsync({
      productId: selectedProductId
    })
    setOffers(res.offers)
    console.log(res.offers)
  }

  useEffect(() => {
    if (selectedProductId) {
      fetchOffers()
    }
  }, [selectedProductId])

  useEffect(() => {
    if (selectedOfferId) {
      fetchVariants()
    }
  }, [selectedOfferId])

  return {
    control,
    offers,
    variants: [],
    selectedProductId,
    selectedOfferId,
    submit: handleSubmit(submit)
  }
}

export default useNewVariantModal
