import {getVariantLabel} from '@/features/order/order-details/useOrderDetails'
import useLoader from '@/hooks/useLoader'
import trpc from '@/utils/trpc'
import {Offer, OfferDetails, Product, Variant} from '@prisma/client'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useForm} from 'react-hook-form'
import {OfferData} from '@/validation'

type UseSelectOfferModal = {
  onSubmit: (data: OfferData) => void
  products: Product[]
  offer?: OfferData
  editMode?: boolean
  open: boolean
  onClose: () => void
}

const useSelectOfferModal = ({
  onSubmit,
  onClose,
  products,
  offer,
  open,
  editMode
}: UseSelectOfferModal) => {
  const getOffersByProductId = trpc.useMutation('offers.getByProductId')
  const getVariantsByProductIds = trpc.useMutation('variants.getByProductIds')
  const {isLoading, ...loader} = useLoader()

  const [variants, setVariants] = useState<Variant[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [initialDataLoaded, setInitialDataLoaded] = useState(!offer)

  const {
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setValue,
    clearErrors,
    control,
    watch,
    reset
  } = useForm<{
    variantIds: {variantId: string; amount: number}[]
    productId: string
    offerId: string
    variantId: string
  }>({
    defaultValues: {
      variantIds: [],
      productId: '',
      offerId: '',
      variantId: ''
    }
  })

  const selectedProductId = watch('productId')
  const selectedOfferId = watch('offerId')
  const selectedVariantId = watch('variantId')
  const variantIds = watch('variantIds')

  const selectedOffer = useMemo(
    () => offers.find((offer: Offer) => offer.id === selectedOfferId) as Offer,
    [offers, selectedOfferId]
  )

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId),
    [selectedVariantId]
  )

  const selectedVariants = useMemo(() => {
    console.log(11, variants, variantIds)
    return variants
      .filter(({id}) => variantIds?.find(({variantId}) => variantId === id))
      .map((variant) => ({
        id: variant.id,
        amount:
          variantIds?.find(({variantId}) => variantId === variant.id)?.amount ||
          0,
        label: getVariantLabel(
          variant,
          (products.find(({id}) => id === variant.productId) as Product)?.name
        )
      }))
  }, [variantIds, selectedOfferId, selectedProductId, variants])

  const offerProductAmounts = useMemo(() => {
    if (!selectedOffer) return []
    return selectedOffer.products.map(({productId, amount}) => ({
      product: products.find((product) => product.id === productId) as Product,
      total: amount,
      selected: variantIds
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
  }, [variantIds, selectedOfferId, selectedProductId, variants])

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

  const cleanForm = () => {
    reset()
    setInitialDataLoaded(false)
    setVariants([])
    setOffers([])
  }

  const submit = useCallback(
    loader.action(async () => {
      try {
        clearErrors()

        if (variantIds) {
          onSubmit({
            offerId: selectedOfferId,
            productId: selectedProductId,
            name:
              offers.find((offer) => offer.id === selectedOfferId)?.name || '',
            variantsInfo: variants
              .filter(
                (variant) =>
                  variantIds
                    ?.map(({variantId}) => variantId)
                    .includes(variant.id)
              )
              .map((variant) => ({
                variantId: variant.id,
                name: getVariantLabel(
                  variant,
                  products?.find(({id}) => id === variant.productId)?.name || ''
                ),
                price: variant.price,
                amount:
                  variantIds?.find(({variantId}) => variantId === variant.id)
                    ?.amount || 0
              }))
          })
          cleanForm()
        }
      } catch (err) {
        console.error(err)
      }
    }),
    [variantIds, selectedOfferId, selectedProductId, variants]
  )

  const handleClose = () => {
    cleanForm()
    onClose()
  }

  const fetchOffers = async (productId?: string) => {
    const res = await getOffersByProductId.mutateAsync({
      productId: productId || selectedProductId
    })
    setOffers((res.offers as Offer[]) || [])

    return res.offers
  }

  const fetchVariants = async (productIds?: string[]) => {
    const res = await getVariantsByProductIds.mutateAsync({
      productIds:
        productIds || selectedOffer.products.map(({productId}) => productId)
    })
    setVariants(res.variants as Variant[])
  }

  const showProductVariants = useCallback(
    (prdtId: string) =>
      selectedOffer &&
      (selectedOffer.products.find(({productId}) => productId === prdtId)
        ?.amount || 0) >
        (variantIds
          ?.filter(
            ({variantId}) =>
              variants.find(({id}) => id === variantId)?.productId === prdtId
          )
          ?.reduce((sum, {amount}) => sum + amount, 0) || 0),
    [selectedOffer, variantIds]
  )

  const variantsToShow = useMemo(
    () =>
      variants.filter((variant: Variant) =>
        showProductVariants(variant.productId)
      ),
    [variants, showProductVariants]
  )

  const variantIncrementEnabled = useCallback(
    (variantId: string) => {
      return variantsToShow.map((variant) => variant.id).includes(variantId)
    },
    [variantsToShow]
  )

  const onAddVariant = (id?: string, amount?: number) => {
    const varId = typeof id === 'string' ? id : selectedVariantId

    const newAmount =
      1 +
      (amount ||
        variantIds?.find(({variantId}) => variantId === varId)?.amount ||
        0)

    setValue(
      'variantIds',
      newAmount === 1
        ? [...(variantIds || []), {variantId: varId, amount: newAmount}]
        : variantIds?.map((variant) =>
            variant.variantId === varId
              ? {...variant, amount: newAmount}
              : variant
          )
    )
  }

  const onRemoveVariant = (variantIdToRemove: string, amount: number) => {
    const newAmount = amount - 1

    setValue(
      'variantIds',
      newAmount
        ? variantIds?.map((item) =>
            item.variantId === variantIdToRemove
              ? {...item, amount: newAmount}
              : item
          )
        : variantIds?.filter(({variantId}) => variantId !== variantIdToRemove)
    )
  }

  useEffect(() => {
    if (selectedProductId && (!offer || initialDataLoaded)) {
      setValue('offerId', '')
      setValue('variantId', '')
      setValue('variantIds', [])
      fetchOffers()
    }
  }, [selectedProductId])

  useEffect(() => {
    if (selectedOffer && (!offer || initialDataLoaded)) {
      setValue('variantId', '')
      setValue('variantIds', [])
      fetchVariants()
    }
  }, [selectedOffer])

  useEffect(() => {
    if (
      !(offer && !initialDataLoaded) &&
      !variantsToShow.find((variant) => variant.id === selectedVariantId)
    ) {
      setValue('variantId', variantsToShow[0]?.id || '')
    }
  }, [variantsToShow])

  const loadOfferData = async () => {
    if (offer) {
      setValue('productId', offer.productId)
      setValue('offerId', offer.offerId)
      setValue('variantIds', offer.variantsInfo)

      const offers = await fetchOffers(offer.productId)
      offers &&
        (await fetchVariants(
          offers
            .find(({id}) => id === offer.offerId)
            ?.products.map((product) => product.productId) as string[]
        ))

      setInitialDataLoaded(true)
    }
  }

  useEffect(() => {
    if (open && offer) {
      loadOfferData()
    } else if (!open) {
      cleanForm()
    }
  }, [open])

  return {
    control,
    offers,
    variants: variantsToShow,
    selectedVariant,
    selectedVariants,
    offerProductAmounts,
    selectedOfferId,
    isOfferValid,
    handleClose,
    variantIncrementEnabled,
    onAddVariant,
    onRemoveVariant,
    submit: handleSubmit(submit)
  }
}

export default useSelectOfferModal
