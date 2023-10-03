import {getVariantLabel} from '@/features/new-order/useNewOrder'
import useLoader from '@/hooks/useLoader'
import trpc from '@/utils/trpc'
import {Offer, OfferDetails, Product, Variant} from '@prisma/client'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useForm} from 'react-hook-form'

type UseSelectOfferModal = {
  onSubmit: (
    offer: Omit<OfferDetails, 'id' | 'orderId'>,
    offerName: string,
    offerVariantsNames: string[]
  ) => void
  products: Product[]
}

const useSelectOfferModal = ({onSubmit, products}: UseSelectOfferModal) => {
  const getOffersByProductId = trpc.useMutation('offers.getByProductId')
  const getVariantsByProductIds = trpc.useMutation('variants.getByProductIds')
  const {isLoading, ...loader} = useLoader()

  const [variants, setVariants] = useState<Variant[]>([])
  const [offers, setOffers] = useState<Offer[]>([])

  const {
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setValue,
    clearErrors,
    control,
    watch
  } = useForm<{
    offerDetails: Partial<OfferDetails>
    productId: string
    offerId: string
    variantId: string
  }>({
    defaultValues: {
      offerDetails: {orderId: '', variantIds: []},
      productId: '',
      offerId: '',
      variantId: ''
    }
  })

  const selectedProductId = watch('productId')
  const selectedOfferId = watch('offerId')
  const selectedVariantId = watch('variantId')
  const offerDetails = watch('offerDetails')

  const selectedOffer = useMemo(
    () => offers.find((offer: Offer) => offer.id === selectedOfferId) as Offer,
    [offers, selectedOfferId]
  )

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId),
    [selectedVariantId]
  )

  const selectedVariants = useMemo(() => {
    return variants
      .filter(
        ({id}) =>
          offerDetails?.variantIds?.find(({variantId}) => variantId === id)
      )
      .map((variant) => ({
        id: variant.id,
        amount:
          offerDetails.variantIds?.find(
            ({variantId}) => variantId === variant.id
          )?.amount || 0,
        label: getVariantLabel(
          variant,
          (products.find(({id}) => id === variant.productId) as Product)?.name
        )
      }))
  }, [offerDetails.variantIds])

  const offerProductAmounts = useMemo(() => {
    if (!selectedOffer) return []
    return selectedOffer.products.map(({productId, amount}) => ({
      product: products.find((product) => product.id === productId) as Product,
      total: amount,
      selected: offerDetails.variantIds
        ?.map(
          ({variantId, amount}) =>
            ({
              amount: amount || 0,
              ...variants.find((variant) => variant.id === variantId)
            }) as Variant & {amount: number}
        )
        .reduce(
          (sum, {productId: pdctId, amount}) =>
            pdctId === productId ? amount + sum : sum,
          0
        )
    }))
  }, [offerDetails.variantIds])

  const isOfferValid = useMemo(
    () =>
      !!offerProductAmounts.length &&
      offerProductAmounts.reduce(
        (valid, productAmount) =>
          valid &&
          productAmount.selected === productAmount.total &&
          !!productAmount.selected,
        true
      ),
    [offerProductAmounts]
  )

  const submit = useCallback(
    loader.action(async () => {
      try {
        clearErrors()

        if (offerDetails) {
          onSubmit(
            offerDetails as OfferDetails,
            offers.find((offer) => offer.id === offerDetails.offerId)?.name ||
              '',
            variants
              .filter(
                (variant) =>
                  offerDetails?.variantIds
                    ?.map(({variantId}) => variantId)
                    .includes(variant.id)
              )
              .map((variant) =>
                getVariantLabel(
                  variant,
                  products?.find(({id}) => id === variant.productId)?.name || ''
                )
              )
          )
        }
      } catch (err) {
        console.error(err)
      }
    }),
    [offerDetails]
  )

  console.log(offerDetails.variantIds)

  const fetchOffers = async () => {
    const res = await getOffersByProductId.mutateAsync({
      productId: selectedProductId
    })
    setOffers(res.offers as Offer[])
  }

  const fetchVariants = async () => {
    const res = await getVariantsByProductIds.mutateAsync({
      productIds: selectedOffer.products.map(({productId}) => productId)
    })
    setVariants(res.variants as Variant[])
  }

  const showProductVariants = useCallback(
    (prdtId: string) => {
      return (
        (selectedOffer.products.find(({productId}) => productId === prdtId)
          ?.amount || 0) >
        (offerDetails.variantIds
          ?.filter(
            ({variantId}) =>
              variants.find(({id}) => id === variantId)?.productId === prdtId
          )
          ?.reduce((sum, {amount}) => sum + amount, 0) || 0)
      )
    },
    [selectedOffer, offerDetails]
  )

  const variantsToShow = useMemo(
    () =>
      variants.filter((variant: Variant) =>
        showProductVariants(variant.productId)
      ),
    [variants, showProductVariants]
  )

  const variantIncrementEnabled = (variantId: string, newAmount: number) => {
    if (!selectedOffer) return true
    const maxAmount =
      selectedOffer.products.find(
        ({productId}) =>
          productId ===
          variants?.find((variant) => variant.id === variantId)?.productId
      )?.amount || 1

    return newAmount <= maxAmount
  }

  const onAddVariant = (id?: string, amount?: number) => {
    const varId = typeof id === 'string' ? id : selectedVariantId

    const newAmount =
      1 +
      (amount ||
        offerDetails.variantIds?.find(({variantId}) => variantId === varId)
          ?.amount ||
        0)

    setValue('offerDetails', {
      ...offerDetails,
      variantIds:
        newAmount === 1
          ? [
              ...(offerDetails.variantIds || []),
              {variantId: varId, amount: newAmount}
            ]
          : offerDetails.variantIds?.map((variant) =>
              variant.variantId === varId
                ? {...variant, amount: newAmount}
                : variant
            )
    })
  }

  const onRemoveVariant = (variantIdToRemove: string, amount: number) => {
    const newAmount = amount - 1

    setValue('offerDetails', {
      ...offerDetails,
      variantIds: newAmount
        ? offerDetails.variantIds?.map((item) =>
            item.variantId === variantIdToRemove
              ? {...item, amount: newAmount}
              : item
          )
        : offerDetails.variantIds?.filter(
            ({variantId}) => variantId !== variantIdToRemove
          )
    })
  }

  useEffect(() => {
    if (selectedProductId) {
      setValue('offerId', '')
      setValue('variantId', '')
      fetchOffers()
    }
  }, [selectedProductId])

  useEffect(() => {
    if (selectedOfferId) {
      setValue('variantId', '')
      setValue('offerDetails', {offerId: selectedOfferId, variantIds: []})
      fetchVariants()
    }
  }, [selectedOfferId])

  useEffect(() => {
    if (!variantsToShow.find((variant) => variant.id === selectedVariantId)) {
      setValue('variantId', variantsToShow[0]?.id || '')
    }
  }, [variantsToShow])

  return {
    control,
    offers,
    variants: variantsToShow,
    selectedVariant,
    selectedVariants,
    offerProductAmounts,
    selectedOfferId,
    isOfferValid,
    variantIncrementEnabled,
    onAddVariant,
    onRemoveVariant,
    submit: handleSubmit(submit)
  }
}

export default useSelectOfferModal
