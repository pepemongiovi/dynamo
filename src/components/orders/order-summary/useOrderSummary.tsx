import trpc from '@/utils/trpc'

const useOrderSummary = () => {
  const test = trpc.useMutation(['users.createTestData'])

  const onSubmit = async () => {
    const res = await test.mutateAsync()
    console.log(res)
  }

  return {onSubmit}
}

export default useOrderSummary
