import * as React from 'react'
import {
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Stack,
  alpha,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import {visuallyHidden} from '@mui/utils'
import {OrderData} from '@/validation'
import {format} from 'date-fns'
import Button from './Button'
import {
  BlockOutlined,
  Cancel,
  CancelOutlined,
  EditSharp,
  WhatsApp
} from '@mui/icons-material'
import {OrderStatus, OrderStatus as OrderStatusType} from '@prisma/client'
import {OrderStatusColor, OrderStatusEnum} from '@/types/utils'

type Data = OrderData

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string}
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: OrderData[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Data'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Cliente'
  },
  {
    id: 'offers',
    numeric: false,
    disablePadding: false,
    label: 'Ofertas'
  },
  {
    id: 'commission',
    numeric: false,
    disablePadding: false,
    label: 'Comissão'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status'
  }
]

interface TableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function TableHead(props: TableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <MuiTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </MuiTableHead>
  )
}

interface TableToolbarProps {
  numSelected: number
}

function TableToolbar(props: TableToolbarProps) {
  const {numSelected} = props

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            )
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{flex: '1 1 100%'}}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{flex: '1 1 100%'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Pedidos realizados
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default function OrdersTable({rows}: {rows: OrderData[]}) {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('date')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(15)

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  )

  const renderTableCells = React.useCallback(() => {
    return (
      <>
        {visibleRows.map((row, index) => {
          const isItemSelected = isSelected(row.name as string)
          const labelId = `table-checkbox-${index}`

          const status = OrderStatusEnum[row.status as OrderStatus]
          const statusColor = OrderStatusColor[row.status as OrderStatus]
          const cancelOrderEnabled =
            row.status === OrderStatus.scheduled ||
            row.status === OrderStatus.confirmed

          return (
            <TableRow
              hover
              onClick={(event) => handleClick(event, row.name as string)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.name}
              selected={isItemSelected}
              sx={{cursor: 'pointer'}}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  inputProps={{
                    'aria-labelledby': labelId
                  }}
                />
              </TableCell>
              <TableCell component="th" scope="row" padding="none">
                <Typography fontSize={15}>
                  {format(new Date(row.date), 'dd/LL/yyyy')}
                </Typography>
                <Typography color="placeholder" fontSize={14}>
                  {format(new Date(row.date), 'hh:mm')}
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Stack justifyContent="center">
                  <Typography>{row.name}</Typography>
                  <Typography
                    fontSize={13}
                    color="placeholder"
                    sx={{display: 'flex', alignItems: 'center', gap: 0.3}}
                  >
                    <WhatsApp
                      sx={{width: 12, height: 12, mb: -0.15}}
                      color="success"
                    />
                    {row.phone}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="left">
                {(row.offers as any).reduce(
                  (result: string, offer: OrderData) =>
                    `${result}${offer.name} `,
                  ''
                )}
              </TableCell>
              <TableCell align="left">
                R$ {Number(row.commission).toFixed(2)}
              </TableCell>
              <TableCell align="left" sx={{width: 100}}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    bgcolor: statusColor.light,
                    width: 100,
                    borderRadius: 5,
                    border: '1.5px solid',
                    borderColor: statusColor.main,

                    py: 0.3
                  }}
                >
                  <Typography color="white" fontSize={15}>
                    {status}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="right">
                <BlockOutlined
                  color={cancelOrderEnabled ? 'error' : 'disabled'}
                />
              </TableCell>
            </TableRow>
          )
        })}
        {emptyRows > 0 && (
          <TableRow
            style={{
              height: (dense ? 33 : 53) * emptyRows
            }}
          >
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </>
    )
  }, [rows, rowsPerPage, selected, visibleRows])

  return (
    <Box sx={{width: '100%', boxShadow: '3px 3px 8px 3px #474787'}}>
      <Paper sx={{width: '100%', mb: 2}}>
        <TableToolbar numSelected={selected.length} />
        <TableContainer>
          <MuiTable
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>{renderTableCells()}</TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  )
}
