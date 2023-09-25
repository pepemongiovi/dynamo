import useLoader from '@/hooks/useLoader'
import {useCallback} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import {signIn, useSession} from 'next-auth/react'
import trpc from '@/utils/trpc'

export type LoginForm = ReturnType<typeof useSignUpForm>

export default function useSignUpForm() {
  const {isLoading, ...loader} = useLoader()
  const {
    register,
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
      password: '',
      serverError: false
    }
  })

  const onSubmit = useCallback(
    loader.action(async () => {
      try {
        clearErrors()
        const email = getValues('email')?.toLocaleLowerCase()

        await signIn('email', {
          email,
          callbackUrl: '/dashboard'
        }).catch(console.error)
      } catch (err) {
        console.error(err)
      }
    }),
    []
  )

  return {
    control,
    register,
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
