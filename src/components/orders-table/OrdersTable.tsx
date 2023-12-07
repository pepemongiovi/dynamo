import * as React from 'react'
import {
  Table as MuiTable,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
  Paper,
  Stack,
  Box,
  CircularProgress
} from '@mui/material'
import useOrdersTable from './useOrdersTable'
import TableToolbar from './TableToolbar'
import TableHead from './TableHead'
import TableCells from './TableCells'

const OrdersTable = ({userId}: {userId?: string}) => {
  const {
    orders,
    ordersToCancel,
    isUpdatingOrders,
    isFetchingOrders,
    selectedOrders,
    page,
    pageSize,
    emptyRows,
    totalOrdersCount,
    handleCancelOrders,
    handleEditOrder,
    handleChangePage,
    handleChangeRowsPerPage,
    handleClick,
    isSelected
  } = useOrdersTable({userId})

  return totalOrdersCount === null ? (
    <CircularProgress sx={{alignSelf: 'center', justifySelf: 'center'}} />
  ) : totalOrdersCount === 0 ? (
    <Typography color="placeholder">Nenhum pedido realizado</Typography>
  ) : (
    <Box sx={{width: '100%', boxShadow: '3px 3px 8px 3px #474787'}}>
      <Paper sx={{width: '100%'}}>
        <TableToolbar
          selectedOrderIds={selectedOrders}
          isUpdatingOrders={isUpdatingOrders}
          handleCancelOrders={handleCancelOrders}
        />
        <TableContainer>
          <MuiTable aria-labelledby="tableTitle" size="medium">
            <TableHead numSelected={selectedOrders.length} />
            <TableBody sx={{position: 'relative'}}>
              <TableCells
                handleClick={handleClick}
                handleCancelOrders={handleCancelOrders}
                handleEditOrder={(id: string) => handleEditOrder(id)}
                isSelected={isSelected}
                emptyRows={emptyRows}
                orders={orders}
                selectedOrders={selectedOrders}
                isUpdatingOrders={isUpdatingOrders}
                ordersToCancel={ordersToCancel}
              />

              {isFetchingOrders && (
                <Typography
                  sx={{
                    alignSelf: 'center',
                    justifySelf: 'center',
                    position: 'absolute',
                    top: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    left: 20
                  }}
                  color="placeholder"
                >
                  Carregando mais pedidos..
                </Typography>
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
        {isFetchingOrders ? (
          <Stack
            sx={{height: 52, pr: 2}}
            alignItems="end"
            justifyContent="center"
          >
            <CircularProgress size={30} />
          </Stack>
        ) : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrdersCount}
            rowsPerPage={pageSize}
            page={page - 1}
            onPageChange={(_, newPage) => handleChangePage(newPage)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  )
}

export default OrdersTable
