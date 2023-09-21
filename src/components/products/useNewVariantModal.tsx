import useLoader from '@/hooks/useLoader'
import {Variant} from '@/types/utils'
import {Product} from '@prisma/client'
import {useCallback, useMemo, useState} from 'react'
import {useForm} from 'react-hook-form'

type UseNewVariantModalProps = {
  onSubmit: (variant: Variant) => void
}

const useNewVariantModal = ({onSubmit}: UseNewVariantModalProps) => {
  const {isLoading, ...loader} = useLoader()
  const {
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setValue,
    setError,
    clearErrors,
    control,
    watch
  } = useForm({
    defaultValues: {
      productId: '',
      offerId: '',
      color: '',
      size: ''
    }
  })

  console.log(getValues())

  const selectedProductId = watch('productId')
  const selectedOfferId = watch('offerId')

  const submit = useCallback(
    loader.action(async () => {
      try {
        clearErrors()
        onSubmit(getValues())
      } catch (err) {
        console.log(err)
      }
    }),
    []
  )

  return {
    control,
    selectedProductId,
    selectedOfferId,
    submit: handleSubmit(submit)
  }
}

export default useNewVariantModal
