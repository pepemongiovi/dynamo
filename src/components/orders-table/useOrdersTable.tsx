import React, {useMemo, useState} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import trpc from '@/utils/trpc'
import {OrderData} from '@/validation'

export default function useOrdersTable({userId}: {userId?: string}) {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [totalOrdersCount, setTotalOrdersCount] = useState<number | null>(null)
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedOrders, setSelectedOrders] = React.useState<readonly string[]>(
    []
  )

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
      email: '',
      password: '',
      page: 1,
      pageSize: 5
    }
  })

  const page = watch('page')
  const pageSize = watch('pageSize')

  const hasDataToFetch =
    (!!userId && !totalOrdersCount) ||
    (!!totalOrdersCount &&
      totalOrdersCount > orders.length &&
      orders.length < selectedPage * pageSize)

  const {isLoading} = trpc.useQuery(
    [
      'orders.getByUserId',
      {userId: userId || '', page: selectedPage, pageSize}
    ],
    {
      enabled: hasDataToFetch,
      onSuccess(data) {
        const totalOrders = 13
        setTotalOrdersCount(totalOrders)
        const loadedOrders = data.orders as any

        if (
          totalOrders > orders.length &&
          orders.length < selectedPage * pageSize
        ) {
          setOrders([...orders, ...loadedOrders])
        }
        setValue('page', selectedPage)
      }
    }
  )

  console.log(page)

  const filteredOrders = useMemo(
    () => orders.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
    [orders, page, pageSize]
  )

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n.name)
      setSelectedOrders(newSelected)
      return
    }
    setSelectedOrders([])
  }

  const handleClick = (name: string) => {
    const selectedIndex = selectedOrders.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedOrders, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedOrders.slice(1))
    } else if (selectedIndex === selectedOrders.length - 1) {
      newSelected = newSelected.concat(selectedOrders.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedOrders.slice(0, selectedIndex),
        selectedOrders.slice(selectedIndex + 1)
      )
    }

    setSelectedOrders(newSelected)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('pageSize', Number(event.target.value))
    setSelectedPage(1)
  }

  const isSelected = (name: string) => selectedOrders.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty orders.
  const emptyRows = isLoading
    ? pageSize
    : totalOrdersCount && page * pageSize >= totalOrdersCount
    ? pageSize - (totalOrdersCount % pageSize)
    : 0

  const handleChangePage = (newPage: number) => {
    const page = newPage + 1
    if (!hasDataToFetch) {
      setValue('page', page)
    }
    setSelectedPage(page)
  }

  return {
    orders: filteredOrders,
    isLoading,
    emptyRows,
    page,
    pageSize,
    selectedOrders,
    totalOrdersCount,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSelectAllClick,
    handleClick,
    isSelected
  }
}
