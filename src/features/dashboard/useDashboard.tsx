import useLoader from '@/hooks/useLoader'
import {useCallback, useEffect, useState} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import {signIn, useSession} from 'next-auth/react'
import trpc from '@/utils/trpc'
import {OrderData} from '@/validation'

export default function useDashboard() {
  const {isLoading, ...loader} = useLoader()
  const [orders, setOrders] = useState<OrderData[]>([])
  const {data: authData} = useSession()
  const fetchOrders = trpc.useMutation(['orders.getByUserId'])
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

  const getOrders = async (userId: string) => {
    const response = await fetchOrders.mutateAsync({userId})
    setOrders(response.orders as any)
  }

  console.log(orders)

  const onSubmit = useCallback(
    loader.action(async () => {
      try {
        clearErrors()
        const {email, password} = getValues()
        await signIn('credentials', {
          email: email.toLowerCase(),
          password: password,
          callbackUrl: '/app/sign-up'
        }).catch((error) => {
          console.info('Error: ', error)
        })
      } catch (err) {
        console.error(err)
      }
    }),
    []
  )

  useEffect(() => {
    const authUserId = authData?.user.id
    if (authUserId) {
      getOrders(authUserId)
    }
  }, [authData?.user?.id])

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
    getValues,
    setValue,
    setError,
    clearErrors,
    orders,
    errors,
    isLoading,
    isValid
  }
}
