import {OrderStatusColor, OrderStatusEnum} from '@/types/utils'
import {OrderData} from '@/validation'
import {
  BlockOutlined,
  CopyAllOutlined,
  Edit,
  EditNote,
  Visibility,
  VisibilityOutlined,
  VisibilityTwoTone,
  WhatsApp
} from '@mui/icons-material'
import {
  Box,
  Checkbox,
  CircularProgress,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import {OrderStatus} from '@prisma/client'
import {format} from 'date-fns'
import {toast} from 'react-toastify'

const TableText = ({value, lineClamp}: {value: string; lineClamp: number}) => (
  <Typography
    fontSize={15}
    sx={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: String(lineClamp),
      WebkitBoxOrient: 'vertical'
    }}
  >
    {value}
  </Typography>
)

const TableCells = ({
  orders,
  selectedOrders,
  emptyRows,
  isUpdatingOrders,
  ordersToCancel,
  isSelected,
  handleClick,
  handleCancelOrders,
  handleEditOrder,
  handleViewOrder
}: {
  orders: OrderData[]
  selectedOrders: string[]
  emptyRows: number
  isUpdatingOrders: boolean
  ordersToCancel: string[]
  isSelected: (name: string) => boolean
  handleClick: (name: string) => void
  handleCancelOrders: (orderIds: string[]) => void
  handleEditOrder: (id: string) => void
  handleViewOrder: (id: string) => void
}) => {
  const rowHeight = 76

  const cancelOrder = (e: any, orderId: string) => {
    e.preventDefault()
    e.stopPropagation()
    handleCancelOrders([orderId])
  }

  return (
    <>
      {orders?.map((order, index) => {
        const isItemSelected = isSelected(order.id as string)
        const labelId = `table-checkbox-${index}`

        const statusLabel = OrderStatusEnum[order.status as OrderStatus]
        const statusColor = OrderStatusColor[order.status as OrderStatus]
        const editOrderEnabled =
          order.status === OrderStatus.scheduled ||
          order.status === OrderStatus.confirmed

        return (
          <TableRow
            hover
            onClick={() =>
              editOrderEnabled ? handleClick(order.id as string) : {}
            }
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={order.id}
            selected={isItemSelected}
            sx={{cursor: 'pointer'}}
          >
            <TableCell padding="checkbox">
              <Checkbox
                disabled={!editOrderEnabled || isUpdatingOrders}
                color="primary"
                checked={isItemSelected}
                inputProps={{
                  'aria-labelledby': labelId
                }}
              />
            </TableCell>

            <TableCell component="th" scope="row" padding="none">
              <Typography fontSize={15}>
                {format(new Date(order.date), 'dd/LL/yyyy')}
              </Typography>
              <Typography color="placeholder" fontSize={14}>
                {format(new Date(order.date), 'hh:mm')}
              </Typography>
            </TableCell>

            <TableCell align="left">
              <Stack justifyContent="center">
                <TableText lineClamp={1} value={order.name} />
                <Typography
                  fontSize={14}
                  color="placeholder"
                  whiteSpace="nowrap"
                  sx={{display: 'flex', alignItems: 'center', gap: 0.3}}
                >
                  <WhatsApp
                    sx={{width: 14, height: 14, mb: -0.15}}
                    color="success"
                  />
                  {order.phone}
                  <CopyAllOutlined
                    sx={{width: 16, height: 16, marginLeft: 0.2}}
                    onClick={(e: any) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(order.phone)
                      toast.info('Telefone copiado!')
                    }}
                  />
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="left">
              <TableText
                lineClamp={2}
                value={(order.offers as any).reduce(
                  (result: string, offer: OrderData, idx: number) =>
                    `${result}${offer.name}${
                      idx < order.offers.length - 1 ? '; ' : ''
                    }`,
                  ''
                )}
              />
            </TableCell>

            <TableCell align="left">
              <Typography
                color={
                  order.status === OrderStatus.delivered
                    ? 'success.main'
                    : undefined
                }
              >
                R$ {Number(order.commission).toFixed(2)}
              </Typography>
            </TableCell>

            <TableCell align="left" sx={{width: 100}}>
              <Box
                sx={{
                  borderRadius: 5,
                  border: '1.5px solid',
                  borderColor: statusColor.main
                }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    bgcolor: statusColor.light,
                    width: 100,
                    borderRadius: 5,
                    py: 0.3,
                    opacity: 0.8
                  }}
                >
                  <Typography color="white" fontSize={15}>
                    {statusLabel}
                  </Typography>
                </Stack>
              </Box>
            </TableCell>

            {!selectedOrders.length && (
              <TableCell align="right">
                <Stack direction="row" spacing={1}>
                  <Tooltip
                    title={
                      editOrderEnabled ? 'Alterar pedido' : 'Visualizar pedido'
                    }
                  >
                    <Box
                      width={25}
                      height={25}
                      component={
                        editOrderEnabled ? EditNote : VisibilityTwoTone
                      }
                      onClick={(e) => {
                        e.stopPropagation()
                        if (editOrderEnabled) {
                          handleEditOrder(order.id)
                        } else {
                          handleViewOrder(order.id)
                        }
                      }}
                    />
                  </Tooltip>

                  <Tooltip
                    title={
                      editOrderEnabled
                        ? 'Cancelar pedido'
                        : 'Cancelamento indisponível'
                    }
                  >
                    <Box
                      component={
                        isUpdatingOrders && ordersToCancel.includes(order.id)
                          ? CircularProgress
                          : BlockOutlined
                      }
                      onClick={(e: any) =>
                        editOrderEnabled ? cancelOrder(e, order.id) : {}
                      }
                      sx={{cursor: editOrderEnabled ? 'pointer' : 'default'}}
                      color={editOrderEnabled ? '#d32f2f' : 'disabled'}
                      size={24}
                    />
                  </Tooltip>
                </Stack>
              </TableCell>
            )}
          </TableRow>
        )
      })}
      {emptyRows > 0 && (
        <TableRow
          style={{
            height: rowHeight * emptyRows
          }}
        >
          <TableCell colSpan={6} />
        </TableRow>
      )}
    </>
  )
}

export default TableCells
