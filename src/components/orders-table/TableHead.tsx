import {OrderData} from '@/validation'
import {
  TableHead as MuiTableHead,
  TableCell,
  TableRow,
  Checkbox
} from '@mui/material'

interface HeadCell {
  disablePadding: boolean
  id: keyof OrderData
  label: string
  numeric: boolean
}

const headCells: HeadCell[] = [
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

interface TableHeadProps {
  numSelected: number
}

function TableHead({numSelected}: TableHeadProps) {
  return (
    <MuiTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < totalOrdersCount}
            checked={totalOrdersCount > 0 && numSelected === totalOrdersCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          /> */}
        </TableCell>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              > */}
            {headCell.label}
            {/* {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel> */}
          </TableCell>
        ))}
        {!numSelected && <TableCell></TableCell>}
      </TableRow>
    </MuiTableHead>
  )
}

export default TableHead
