import useLoader from '@/hooks/useLoader'
import {useCallback} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import {signIn} from 'next-auth/react'
import trpc from '@/utils/trpc'

export default function useLoginForm() {
  const {isLoading, ...loader} = useLoader()
  const {
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setValue,
    setError,
    clearErrors,
    control
  } = useFormHook({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = useCallback(
    loader.action(async () => {
      try {
        clearErrors()
        const {email, password} = getValues()
        await signIn('credentials', {
          email: email.toLowerCase(),
          password: password,
          callbackUrl: '/app/dashboard'
        }).catch((error) => {
          console.info('Error: ', error)
        })
      } catch (err) {
        console.log(err)
      }
    }),
    []
  )

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
    getValues,
    setValue,
    setError,
    clearErrors,
    errors,
    isLoading,
    isValid
  }
}
