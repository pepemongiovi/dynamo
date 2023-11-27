import {OrderStatusColor, OrderStatusEnum} from '@/types/utils'
import {OrderData} from '@/validation'
import {BlockOutlined, WhatsApp} from '@mui/icons-material'
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
  handleCancelOrders
}: {
  orders: OrderData[]
  selectedOrders: string[]
  emptyRows: number
  isUpdatingOrders: boolean
  ordersToCancel: string[]
  isSelected: (name: string) => boolean
  handleClick: (name: string) => void
  handleCancelOrders: (orderIds: string[]) => void
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
        const cancelOrderEnabled =
          order.status === OrderStatus.scheduled ||
          order.status === OrderStatus.confirmed

        return (
          <TableRow
            hover
            onClick={() =>
              cancelOrderEnabled ? handleClick(order.id as string) : {}
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
                disabled={!cancelOrderEnabled || isUpdatingOrders}
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
                  fontSize={13}
                  color="placeholder"
                  whiteSpace="nowrap"
                  sx={{display: 'flex', alignItems: 'center', gap: 0.3}}
                >
                  <WhatsApp
                    sx={{width: 12, height: 12, mb: -0.15}}
                    color="success"
                  />
                  {order.phone}
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="left">
              <TableText
                lineClamp={2}
                value={(order.offers as any).reduce(
                  (result: string, offer: OrderData) =>
                    `${result}${offer.name} `,
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
                <Tooltip
                  title={
                    !cancelOrderEnabled
                      ? 'Cancelamento indisponível'
                      : 'Cancelar pedido'
                  }
                >
                  <Box
                    component={
                      isUpdatingOrders && ordersToCancel.includes(order.id)
                        ? CircularProgress
                        : BlockOutlined
                    }
                    onClick={(e: any) =>
                      cancelOrderEnabled ? cancelOrder(e, order.id) : {}
                    }
                    sx={{cursor: cancelOrderEnabled ? 'pointer' : 'default'}}
                    color={cancelOrderEnabled ? '#d32f2f' : 'disabled'}
                    size={24}
                  />
                </Tooltip>
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
