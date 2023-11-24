import {useForm as useFormHook} from 'react-hook-form'
import {useSession} from 'next-auth/react'

export default function useDashboard() {
  const {data: authData} = useSession()

  const {control} = useFormHook({
    defaultValues: {
      search: ''
    }
  })

  return {
    control,
    userId: authData?.user?.id
  }
}
