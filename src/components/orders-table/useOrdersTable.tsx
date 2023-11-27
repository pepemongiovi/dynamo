import React, {useMemo, useState} from 'react'
import {useForm as useFormHook} from 'react-hook-form'
import trpc from '@/utils/trpc'
import {OrderData} from '@/validation'
import {OrderStatus} from '@prisma/client'
import {toast} from 'react-toastify'

export default function useOrdersTable({userId}: {userId?: string}) {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [totalOrdersCount, setTotalOrdersCount] = useState<number | null>(null)
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([])
  const [ordersToCancel, setOrdersToCancel] = useState<string[]>([])

  const {isLoading: isUpdatingOrders, mutateAsync: updateOrdersStatus} =
    trpc.useMutation(['orders.updateOrdersStatus'])

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
      orders.length < page * pageSize)

  const {isLoading: isFetchingOrders} = trpc.useQuery(
    ['orders.getByUserId', {userId: userId || '', page, pageSize}],
    {
      enabled: hasDataToFetch,
      onSuccess(data) {
        const totalOrders = data.count
        if (data.count !== null) {
          setTotalOrdersCount(totalOrders)
        }
        const loadedOrders = data.orders as any

        setOrders([...orders, ...loadedOrders])

        setValue('page', page)
      }
    }
  )

  const filteredOrders = useMemo(
    () => orders.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
    [orders, page, pageSize]
  )

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n.id)
      setSelectedOrders(newSelected)
      return
    }
    setSelectedOrders([])
  }

  const handleClick = (id: string) => {
    const selectedIndex = selectedOrders.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedOrders, id)
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
    setValue('page', 1)
    setOrders([])
  }

  const isSelected = (id: string) => selectedOrders.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty orders.
  const emptyRows = useMemo(() => {
    if (isFetchingOrders) return pageSize
    if (page === 1) return 0
    if (totalOrdersCount && page * pageSize >= totalOrdersCount) {
      return pageSize - (totalOrdersCount % pageSize)
    }
    return 0
  }, [page, pageSize, totalOrdersCount, isFetchingOrders])

  const handleChangePage = (newPage: number) => {
    setValue('page', newPage + 1)
  }

  const handleCancelOrders = async (ids?: string[]) => {
    const orderIds = ids || selectedOrders
    setOrdersToCancel(orderIds)

    await updateOrdersStatus(
      {ids: orderIds},
      {
        onSuccess: () => {
          setOrders(
            orders.map((order) =>
              orderIds.includes(order.id)
                ? {...order, status: OrderStatus.canceled}
                : order
            )
          )
        },
        onError: () => {
          toast.error('Não foi possível cancelar o pedido')
        }
      }
    )
    setSelectedOrders([])
  }

  return {
    orders: filteredOrders,
    ordersToCancel,
    isUpdatingOrders,
    isFetchingOrders,
    emptyRows,
    page,
    pageSize,
    selectedOrders,
    totalOrdersCount,
    handleCancelOrders,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSelectAllClick,
    handleClick,
    isSelected
  }
}
